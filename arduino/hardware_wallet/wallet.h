#ifndef _ARDUINO_HARDWARE_WALLET_WALLET_H_
#define _ARDUINO_HARDWARE_WALLET_WALLET_H_

#include "config.h"
#include <Bitcoin.h>

byte getRandomByte(int analogInput = A0);
HDPrivateKey getRandomKey(int analogInput = A0);

#endif // _ARDUINO_HARDWARE_WALLET_WALLET_H_