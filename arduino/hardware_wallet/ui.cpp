#include "ui.h"
#include <Bitcoin.h>

// the screen
Adafruit_FeatherOLED oled = Adafruit_FeatherOLED();

void ui_init(){
    // setting buttons as inputs
    pinMode(9, INPUT_PULLUP);
    pinMode(6, INPUT_PULLUP);
    pinMode(5, INPUT_PULLUP);
    // screen init
    oled.init();
    oled.setBatteryVisible(false);
}

// cleans the display and shows message on the screen
void show(String msg, bool done){
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