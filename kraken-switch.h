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
