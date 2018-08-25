#ifndef _ARDUINO_HARDWARE_WALLET_UI_H_
#define _ARDUINO_HARDWARE_WALLET_UI_H_

#include "config.h"
#include <Bitcoin.h>

#if USER_INTERFACE == OLED

// OLED screen libs
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_FeatherOLED.h>

#endif // USER_INTERFACE == OLED

void show(String msg, bool done=true);
bool requestTransactionSignature(Transaction tx);
void ui_init();

#endif // _ARDUINO_HARDWARE_WALLET_UI_H_