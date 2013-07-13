#include "KrakenSwitch.h"

KrakenSwitch::KrakenSwitch() {
  this->transmitterPin = -1;
  this->setPulseLength(350);
  this->setRepeatTransmit(10);
  this->setProtocol(1);
}

/**
  * Sets the protocol to send.
  */
void KrakenSwitch::setProtocol(int protocol) {
  this->protocol = protocol;
  if (protocol == 1){
    this->setPulseLength(350);
  }
  else if (protocol == 2) {
    this->setPulseLength(650);
  }
  else if (protocol == 3) {
    this->setPulseLength(100);
  }
}

/**
  * Sets pulse length in microseconds
  */
void KrakenSwitch::setPulseLength(int pulseLength) {
  this->pulseLength = pulseLength;
}

/**
 * Sets Repeat Transmits
 */
void KrakenSwitch::setRepeatTransmit(int repeatTransmit) {
  this->repeatTransmit = repeatTransmit;
}
 

/**
 * Enable transmissions
 *
 * @param nTransmitterPin    Arduino Pin to which the sender is connected to
 */
void KrakenSwitch::enableTransmit(int transmitterPin) {
  this->transmitterPin = transmitterPin;
  pinMode(this->transmitterPin, OUTPUT);
}

/**
  * Disable transmissions
  */
void KrakenSwitch::disableTransmit() {
  this->transmitterPin = -1;
}

/**
 * @param sCodeWord   /^[10FS]*$/  -> see getCodeWord
 */
void KrakenSwitch::sendTriState(char* codeWord) {
  for (int repeat=0; repeat<repeatTransmit; repeat++) {
    int i = 0;
    while (codeWord[i] != '\0') {
      switch(codeWord[i]) {
        case '0':
          this->transmit(1,3);
          this->transmit(1,3);
        break;
        case 'F':
          this->transmit(1,3);
          this->transmit(3,1);
        break;
        case '1':
          this->transmit(3,1);
          this->transmit(3,1);
        break;
      }
      i++;
    }
    this->sendSync();    
  }
}

void KrakenSwitch::transmit(int highPulses, int lowPulses) {
    if (this->transmitterPin != -1) {
        digitalWrite(this->transmitterPin, HIGH);
        delayMicroseconds( this->pulseLength * highPulses);
        digitalWrite(this->transmitterPin, LOW);
        delayMicroseconds( this->pulseLength * lowPulses);
    }
}
/**
 * Sends a "0" Bit
 *                       _    
 * Waveform Protocol 1: | |___
 *                       _  
 * Waveform Protocol 2: | |__
 */
void KrakenSwitch::send0() {
    if (this->protocol == 1){
        this->transmit(1,3);
    }
    else if (this->protocol == 2) {
        this->transmit(1,2);
    }
    else if (this->protocol == 3) {
        this->transmit(4,11);
    }
}

/**
 * Sends a "1" Bit
 *                       ___  
 * Waveform Protocol 1: |   |_
 *                       __  
 * Waveform Protocol 2: |  |_
 */
void KrakenSwitch::send1() {
      if (this->protocol == 1){
        this->transmit(3,1);
    }
    else if (this->protocol == 2) {
        this->transmit(2,1);
    }
    else if (this->protocol == 3) {
        this->transmit(9,6);
    }
}


/**
 * Sends a "Sync" Bit
 *                       _
 * Waveform Protocol 1: | |_______________________________
 *                       _
 * Waveform Protocol 2: | |__________
 */
void KrakenSwitch::sendSync() {

    if (this->protocol == 1){
        this->transmit(1,31);
    }
    else if (this->protocol == 2) {
        this->transmit(1,10);
    }
    else if (this->protocol == 3) {
        this->transmit(1,71);
    }
}
