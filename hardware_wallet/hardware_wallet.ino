// bitcoin library
#include <Bitcoin.h>

// screen libs
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_FeatherOLED.h>

// SD card libs
#include <SPI.h>
#include <SD.h>

// private key
HDPrivateKey hd;

// the screen
Adafruit_FeatherOLED oled = Adafruit_FeatherOLED();

// set to false to use on mainnet
#define USE_TESTNET true

// cleans the display and shows message on the screen
void show(String msg, bool done=true){
    oled.clearDisplay();
    oled.setCursor(0,0);
    oled.println(msg);
    if(done){
        oled.display();
    }
}

// This function displays info about transaction.
// As OLED screen is small we show one output at a time
// and use Button B to switch to the next output
// Buttons A and C work as Confirm and Cancel
bool requestTransactionSignature(Transaction tx){
    // when digital pins are set with INPUT_PULLUP in the setup
    // they show 1 when not pressed, so we need to invert them
    bool confirm = !digitalRead(9);
    bool not_confirm = !digitalRead(5);
    bool more_info = !digitalRead(6);
    int i = 0; // index of output that we show
    // waiting for user to confirm / cancel
    while((!confirm && !not_confirm)){
        // show one output on the screen
        oled.clearDisplay();
        oled.setCursor(0,0);
        oled.print("Sign? Output ");
        oled.print(i);
        oled.println();
        TransactionOutput output = tx.txOuts[i];
        oled.print(output.address(USE_TESTNET));
        oled.println(":");
        oled.print(((float)output.amount)/100000);
        oled.print(" mBTC");
        oled.display();
        // waiting user to press any button
        while((!confirm && !not_confirm && !more_info)){
            confirm = !digitalRead(9);
            not_confirm = !digitalRead(5);
            more_info = !digitalRead(6);
        }
        delay(300); // wait to release the button
        more_info = false; // reset to default
        // scrolling output
        i++;
        if(i >= tx.outputsNumber){
            i=0;
        }
    }
    if(confirm){
        show("Ok, confirmed.\nSigning...");
        return true;
    }else{
        show("Cancelled");
        return false;
    }
}

void sign_tx(char * cmd){
    Transaction tx;
    // first we need to convert tx from hex
    byte raw_tx[2000];
    bool electrum = false;
    size_t l = fromHex(cmd, strlen(cmd), raw_tx, sizeof(raw_tx));
    if(l == 0){
        show("can't decode tx from hex");
        Serial.println("error: can't decode tx from hex");
        return;
    }
    // check if transaction is from electrum
    if(memcmp(raw_tx,"EPTF",4)!=0){
        // TODO: add PSBT support
        Serial.println("error: not electrum transaction");
        return;
    }
    // then we parse transaction
    size_t l_parsed = tx.parse(raw_tx+6, l-6);
    if(l_parsed == 0){
        show("can't parse tx");
        Serial.println("error: can't parse tx");
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
                Serial.print("error: wrong key on input ");
                Serial.println(i);
                show("Wrong master pubkey!");
                return;
            }
            int index1 = littleEndianToInt(arr+scriptLen-4, 2);
            int index2 = littleEndianToInt(arr+scriptLen-2, 2);
            tx.signInput(i, hd.child(index1).child(index2).privateKey);
        }
        show("ok, signed");
        Serial.print("success: ");
        Serial.println(tx);
    }else{
        show("cancelled");
        Serial.println("error: user cancelled");
    }
}

void load_xprv(){
    show("Loading private key");
    if (!SD.begin(4)){
        Serial.println("error: no SD card");
        return;
    }
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
            Serial.println("success: private key loaded");
            // we will use bip44: m/44'/coin'/0' 
            // coin = 1 for testnet, 0 for mainnet
            hd = imported_hd.hardenedChild(44).hardenedChild(USE_TESTNET).hardenedChild(0);
            show(hd); // show xprv on the screen
            Serial.println(hd.xpub()); // print xpub to serial
        }else{
            Serial.println("error: can't parse xprv.txt");
        }
    } else {
        Serial.println("error: xprv.txt file is missing");
    }
}

void get_address(char * cmd, bool change=false){
    String s(cmd);
    int index = s.toInt();
    String addr = hd.child(change).child(index).privateKey.address();
    Serial.println(addr);
    show(addr);
}

void parseCommand(char * cmd){
    if(memcmp(cmd, "sign_tx", strlen("sign_tx"))==0){
        sign_tx(cmd + strlen("sign_tx") + 1);
        return;
    }
    if(memcmp(cmd, "load_xprv", strlen("load_xprv"))==0){
        load_xprv();
        return;
    }
    if(memcmp(cmd, "xpub", strlen("xpub"))==0){
        Serial.println(hd.xpub());
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
    Serial.println("error: unknown command");
}

void setup() {
    // setting buttons as inputs
    pinMode(9, INPUT_PULLUP);
    pinMode(6, INPUT_PULLUP);
    pinMode(5, INPUT_PULLUP);
    // screen init
    oled.init();
    oled.setBatteryVisible(false);
    show("I am alive!");
    // serial connection
    Serial.begin(9600);
    // loading master private key
    load_xprv();
    while(!Serial){
        ; // wait for serial port to open
    }
    show("Ready for requests");
}

void loop() {
    // reads serial port
    while(Serial.available()){
        // stores new request
        char buf[4000] = { 0 };
        // reads a line to buf
        Serial.readBytesUntil('\n', buf, sizeof(buf));
        // parses the command and does something
        parseCommand(buf);    
        // clear the buffer
        memset(buf, 0, sizeof(buf));
    }
}
