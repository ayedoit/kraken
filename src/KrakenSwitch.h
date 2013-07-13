

    #ifndef _KrakenSwitch_h
    #define _KrakenSwitch_h

    #if defined(ARDUINO) && ARDUINO >= 100
        #include "Arduino.h"
    #else
        #include <wiringPi.h>
        #include <stdint.h>
        #define NULL 0
        #define CHANGE 1
    #ifdef __cplusplus
    extern "C"{
    #endif
    typedef uint8_t boolean;
    typedef uint8_t byte;

    #if !defined(NULL)
    #endif
    #ifdef __cplusplus
    }
    #endif
    #endif

class KrakenSwitch {
    public:
    KrakenSwitch();

    void sendTriState(char* Code);

    void enableTransmit(int transmitterPin);
    void disableTransmit();
    void setPulseLength(int pulseLength);
    void setRepeatTransmit(int repeatTransmit);
    void setProtocol(int protocol);

    private:
    void send0();
    void send1();
    void sendSync();
    void transmit(int nHighPulses, int nLowPulses);

    int transmitterPin;
    int pulseLength;
    int repeatTransmit;
    char protocol;
    
};
#endif
