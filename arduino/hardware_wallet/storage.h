#ifndef _ARDUINO_HARDWARE_WALLET_STORAGE_H_
#define _ARDUINO_HARDWARE_WALLET_STORAGE_H_

#include "config.h"

#if STORAGE == SDCARD

// SD card libs
#include <SPI.h>
#include <SD.h>

#endif // STORAGE == SDCARD

#endif // _ARDUINO_HARDWARE_WALLET_STORAGE_H_