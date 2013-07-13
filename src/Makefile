all: kraken-sendcode

kraken-sendcode: KrakenSwitch.o kraken-sendcode.o
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $+ -o $@ -lwiringPi

clean:
	$(RM) *.o kraken-sendcode
