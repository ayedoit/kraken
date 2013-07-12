#!/bin/bash

INTERFACES=`ifconfig | awk '/Link/ { print $1 }'`

for INTERFACE in $INTERFACES; 
do
	if [ "$INTERFACE" != "lo" ];
	then
		IP=`ip a s $INTERFACE | awk 'NR==3 {print $2}'`
		if [ "$IP" != "" ]
		then
			echo $IP
		fi
	fi
done


