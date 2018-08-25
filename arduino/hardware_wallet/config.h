#ifndef _ARDUINO_HARDWARE_WALLET_CONFIG_H_
#define _ARDUINO_HARDWARE_WALLET_CONFIG_H_

// definitions for options below:
#define NOTHING 0 // not supported, but in general we can programm some
				  // dummy behaviour in this case, i.e. always confirming requests
				  // or not storing data at all
#define SERIAL  1 // can be used for ui and host communication
#define OLED    2 // ui only
#define TFT     3 // ui only, not supported right now
#define SDCARD  4 // storage only


/*********** EDIT OPTIONS BELOW *************/

// Do we want to use testnet or not?
#define USE_TESTNET true

// user interface options (OLED / SERIAL)
#define USER_INTERFACE OLED

// communication to the host
#define HOST_COMMUNICATION SERIAL

// Storage 
#define STORAGE SDCARD

#endif // _ARDUINO_HARDWARE_WALLET_CONFIG_H_