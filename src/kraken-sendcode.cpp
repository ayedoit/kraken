/*
 Usage: kraken-sendcode codeword
 */

#include "KrakenSwitch.h"
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    
    /*
     GPIO17 = wiringpi PIN 0
     */
    int PIN = 0;
    char* codeword = argv[1];
    
    if (wiringPiSetup () == -1) return 1;
	printf("sending codeword[%s]\n", codeword);
	KrakenSwitch kraken = KrakenSwitch();
	kraken.enableTransmit(PIN);
    
    kraken.sendTriState(codeword);
	return 0;
}
