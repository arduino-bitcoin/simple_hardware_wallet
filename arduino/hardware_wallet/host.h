#ifndef _ARDUINO_HARDWARE_WALLET_HOST_H_
#define _ARDUINO_HARDWARE_WALLET_HOST_H_

#include "config.h"
#include <Arduino.h>

class Host : public Stream{
private:
	Stream * stream = &Serial;
public:
	Host(){};
	Host(Stream &s){ stream = &s; };
    int available(){ return stream->available(); };
    int read(){ return stream->read(); };
    int peek(){ return stream->peek(); };
    void flush(){ return stream->flush(); };
    size_t readBytes( uint8_t * buffer, size_t length){ return stream->readBytes(buffer, length); };
    size_t write(uint8_t b){ return stream->write(b); };
    size_t write(uint8_t * arr, size_t length){ return stream->write(arr, length); };
    int error(const char * message);
    int success(const char * message);
    int success(const String &s);
};

// #if HOST_COMMUNICATION == SERIAL
// #define Host Serial
// #endif HOST_COMMUNICATION == SERIAL

#endif // _ARDUINO_HARDWARE_WALLET_HOST_H_