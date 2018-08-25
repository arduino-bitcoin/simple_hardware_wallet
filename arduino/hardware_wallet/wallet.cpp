#include "wallet.h"
#include <Bitcoin.h>
#include <Hash.h>

// uses last bit of the analogRead values
// to generate a random byte
byte getRandomByte(int analogInput){
    byte val = 0;
    for(int i = 0; i < 8; i++){
        int init = analogRead(analogInput);
        int count = 0;
        // waiting for analog value to change
        while(analogRead(analogInput) == init){
            ++count;
        }
        // if we've got a new value right away 
        // use last bit of the ADC
        if (count == 0) { 
            val = (val << 1) | (init & 0x01);
        } else { // if not, use last bit of count
            val = (val << 1) | (count & 0x01);
        }
    }
}

HDPrivateKey getRandomKey(int analogInput){
    byte seed[64];
    // fill seed with random bytes
    for(int i=0; i<sizeof(seed); i++){
        seed[i] = getRandomByte(analogInput);
    }
    // increase randomness by applying sha512
    // seed -> sha512(seed)
    sha512(seed, sizeof(seed), seed);
    HDPrivateKey key;
    key.fromSeed(seed, sizeof(seed), USE_TESTNET);
    return key;
}