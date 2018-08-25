// config file - tune it for hardware you use
#include "config.h"
#include "ui.h"
#include "wallet.h"
#include "storage.h"
#include "host.h"

// bitcoin library
#include <Bitcoin.h>
#include <Hash.h>

// root key (master)
HDPrivateKey rootKey;
// account key (m/44'/1'/0'/)
HDPrivateKey hd;

Host host(Serial);

void sign_tx(char * cmd){
    Transaction tx;
    // first we need to convert tx from hex
    byte raw_tx[2000];
    bool electrum = false;
    size_t l = fromHex(cmd, strlen(cmd), raw_tx, sizeof(raw_tx));
    if(l == 0){
        show("can't decode tx from hex");
        host.error("can't decode tx from hex");
        return;
    }
    // check if transaction is from electrum
    if(memcmp(raw_tx,"EPTF",4)!=0){
        // TODO: add PSBT support
        host.error("not electrum transaction");
        return;
    }
    // then we parse transaction
    size_t l_parsed = tx.parse(raw_tx+6, l-6);
    if(l_parsed == 0){
        show("can't parse tx");
        host.error("can't parse tx");
        return;
    }
    bool ok = requestTransactionSignature(tx);
    if(ok){
        for(int i=0; i<tx.inputsNumber; i++){
            // unsigned transaction from electrum has all info in scriptSig:
            // 01ff4c53ff<xpub><2-byte index1><2-byte index2>
            byte arr[100] = { 0 };
            // serialize() will add script len varint in the beginning
            // serializeScript will give only script content
            size_t scriptLen = tx.txIns[i].scriptSig.serializeScript(arr, sizeof(arr));
            // it's enough to compare public keys of hd keys
            byte sec[33];
            hd.privateKey.publicKey().sec(sec, 33);
            if(memcmp(sec, arr+50, 33) != 0){
                host.error("wrong key on input ");
                host.println(i);
                show("Wrong master pubkey!");
                return;
            }
            int index1 = littleEndianToInt(arr+scriptLen-4, 2);
            int index2 = littleEndianToInt(arr+scriptLen-2, 2);
            tx.signInput(i, hd.child(index1).child(index2).privateKey);
        }
        show("ok, signed");
        host.success(tx);
    }else{
        show("cancelled");
        host.error("user cancelled");
    }
}

void load_xprv(){
    show("Loading private key");
    // open the file. note that only one file can be open at a time,
    // so you have to close this one before opening another.
    File file = SD.open("xprv.txt");
    char xprv_buf[120] = { 0 };
    if(file){
        // read content from the file to buffer
        size_t len = file.available();
        if(len > sizeof(xprv_buf)){
            len = sizeof(xprv_buf);
        }
        file.read(xprv_buf, len);
        // close the file
        file.close();
        // import hd key from buffer
        HDPrivateKey imported_hd(xprv_buf);
        if(imported_hd){ // check if parsing was successfull
            host.success("private key loaded");
            // we will use bip44: m/44'/coin'/0' 
            // coin = 1 for testnet, 0 for mainnet
            rootKey = imported_hd;
            hd = rootKey.hardenedChild(44).hardenedChild(USE_TESTNET).hardenedChild(0);
            show(hd); // show xprv on the screen
            host.println(hd.xpub()); // print xpub to serial
        }else{
            host.error("can't parse xprv.txt");
        }
    } else {
        host.error("xprv.txt file is missing");
    }
}

void get_address(char * cmd, bool change=false){
    String s(cmd);
    int index = s.toInt();
    String addr = hd.child(change).child(index).privateKey.address();
    host.println(addr);
    show(addr);
}

void generate_key(){
    show("Generating new key...");
    rootKey = getRandomKey();
    hd = rootKey.hardenedChild(44).hardenedChild(USE_TESTNET).hardenedChild(0);
    show(hd);
    host.success("random key generated");
    host.println(hd.xpub());
}

void parseCommand(char * cmd){
    if(memcmp(cmd, "sign_tx", strlen("sign_tx"))==0){
        sign_tx(cmd + strlen("sign_tx") + 1);
        return;
    }
    // TODO: load_xprv <file>
    if(memcmp(cmd, "load_xprv", strlen("load_xprv"))==0){
        load_xprv();
        return;
    }
    if(memcmp(cmd, "xpub", strlen("xpub"))==0){
        host.println(hd.xpub());
        return;
    }
    if(memcmp(cmd, "addr", strlen("addr"))==0){
        get_address(cmd + strlen("addr"));
        return;
    }
    if(memcmp(cmd, "changeaddr", strlen("changeaddr"))==0){
        get_address(cmd + strlen("changeaddr"), true);
        return;
    }
    if(memcmp(cmd, "generate_key", strlen("generate_key"))==0){
        generate_key();
        return;
    }
    // TODO: save_xprv <file>
    host.error("unknown command");
}

void setup() {
    ui_init();
    show("I am alive!");
    // serial connection
    // after this we can use host everywhere
    Serial.begin(9600);
    // loading master private key
    if (!SD.begin(4)){
        host.error("no SD card controller on pin 4");
        return;
    }
    load_xprv();
    while(!Serial){
        ; // wait for serial port to open
    }
    show("Ready for requests");
}

void loop() {
    // reads serial port
    while(host.available()){
        // stores new request
        char buf[4000] = { 0 };
        // reads a line to buf
        host.readBytesUntil('\n', buf, sizeof(buf));
        // parses the command and does something
        parseCommand(buf);    
        // clear the buffer
        memset(buf, 0, sizeof(buf));
    }
}
