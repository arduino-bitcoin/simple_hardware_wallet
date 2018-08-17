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
void show(char * msg, bool done=true){
    oled.clearDisplay();
    oled.setCursor(0,0);
    oled.println(msg);
    if(done){
        oled.display();
    }
}

void show(String msg, bool done=true){
    oled.clearDisplay();
    oled.setCursor(0,0);
    oled.println(msg);
    if(done){
        oled.display();
    }
}

// waits for user to press a button
bool userConfirmed(){
    bool confirm = digitalRead(5);
    bool not_confirm = digitalRead(9);
    // if none of the buttons is pressed
    while((confirm && not_confirm)){
        confirm = digitalRead(5);
        not_confirm = digitalRead(9);
    }
    if(confirm){
        show("Ok, confirmed");
        return true;
    }else{
        show("Cancelled");
        return false;
    }
}

char buf[4000] = { 0 }; // stores new request
bool v = false; // user confirmation

bool requestTransactionSignature(Transaction * tx){
    bool confirm = digitalRead(5);
    bool not_confirm = digitalRead(9);
    bool more_info = digitalRead(6);
    int i = 0; // index of output that we show
    // waiting for user to confirm / cancel
    while((confirm && not_confirm)){
        // waiting user to press any button
        oled.clearDisplay();
        oled.setCursor(0,0);
        oled.print("Sign? Output ");
        oled.print(i);
        oled.println();
        TransactionOutput output = tx->txOuts[i];
        oled.print(output.address(USE_TESTNET));
        oled.println(":");
        oled.print(((float)output.amount)/100000);
        oled.print(" mBTC");
        oled.display();
        while((confirm && not_confirm && more_info)){
            confirm = digitalRead(5);
            not_confirm = digitalRead(9);
            more_info = digitalRead(6);
        }
        delay(100); // wait to release the button
        more_info = true; // reset to default
        // scrolling output
        i++;
        if(i >= tx->outputsNumber){
            i=0;
        }
    }
    if(confirm){
        show("Ok, confirmed");
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
    bool ok = requestTransactionSignature(&tx);
    if(ok){
        for(int i=0; i<tx.inputsNumber; i++){
            TransactionInput input = tx.txIns[i];
            // unsigned transaction from electrum has all info in scriptSig:
            // 01ff4c53ff<xpub><2-byte index1><2-byte index2>
            byte arr[100] = { 0 };
            // serialize() will add script len varint in the beginning
            // serializeScript will give only script content
            size_t scriptLen = input.scriptSig.serializeScript(arr, sizeof(arr));
            // TODO: compare xpub to ours
            // for now just grab two indexes for derivation
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
        int cursor = 0;
        // read from the file until there's nothing else in it:
        while(file.available() && cursor < sizeof(xprv_buf)) {
            char c = file.read();
            if(c == '\n'){
                break;
            }
            xprv_buf[cursor] = c;
            cursor ++;
        }
        // close the file
        file.close();
        // import hd key from buffer
        HDPrivateKey imported_hd(xprv_buf);
        if(imported_hd.isValid()){ // check if parsing was successfull
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

void unknown_command(const char * cmd){
    Serial.println("error: unknown command");
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
    unknown_command(cmd);
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
    load_xprv();
    while(!Serial){
        ; // wait for serial port to open
    }
    show("Ready for requests");
}

void loop() {
    // reads serial port
    while(Serial.available()){
        // reads a line to buf
        Serial.readBytesUntil('\n', buf, sizeof(buf));
        // parses the command and does something
        parseCommand(buf);    
        // clear the buffer
        memset(buf, 0, sizeof(buf));
    }
}
