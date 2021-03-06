/**
 * Interface class deals with currently supported Send / Recieve interfaces
 */

 // INTERFACES
function Interfaces() {
    this.interfaces = [
        {
            "name":"433",
            "vendors":[
                {
                    "name":"elro",
                    "clear_name":"Elro",
                    "models": [
                        {
                            "name":"ab440sc",
                            "clear_name":"AB 440SC",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"ab440s",
                            "clear_name":"AB 440S",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name":"pollin",
                    "clear_name":"Pollin",
                    "models": [
                        {
                            "name":"2605",
                            "clear_name":"2605",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name":"intertechno",
                    "clear_name":"Intertechno",
                    "models": [
                        {
                            "name":"itr1500",
                            "clear_name":"ITR 1500",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"cmr1000",
                            "clear_name":"CMR 1000",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"cmr300",
                            "clear_name":"CMR 300",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"itlr300",
                            "clear_name":"ITLR 300",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"par1500",
                            "clear_name":"PAR-1500",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        },
                        {
                            "name":"itlr3500",
                            "clear_name":"ITLR 3500",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name":"dario",
                    "clear_name":"Dario",
                    "models": [
                        {
                            "name":"dmv-7008as",
                            "clear_name":"DMV 7008AS",
                            "protocol":"1",
                            "actions": [
                                {
                                    "name":"set_status",
                                    "clear_name":"Status setzen"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    // Port to listen on
    this.port = 8080;

    // Time
    var now = new Date();
    // this.date = now.format("d.m.Y hh:MM:ss");
    this.date = "";

    // Default for Protocol 1 (which fits for most devices)
    this.pulseLength = 350;

    // Default Protocol
    this.protocol = 1;

    // Debug?
    this.debug = true;

    // Version
    this.version = "0.0.3";

    // Path of "kraken-sendcode" binary
    this.kraken_sendcode = '/usr/local/bin/kraken-sendcode';

    // Values that will be set as soon as a device has been chosen
    this.master_dip = "";
    this.slave_dip = "";
    this.vendor = "";
    this.model = "";
    this.interface = "";
    this.action = "";
    this.status = "";
}

/**
 * Set params for execution of commands
 * Param: interface,vendor,model,protocol,master_dip,slave_dip
 * Returns: all currently known data regarding this interface
 */
Interfaces.prototype.setParams = function (interface,vendor,model,protocol,master_dip,slave_dip,action,status) {
    this.interface = interface;
    this.vendor = vendor;
    this.model = model;
    this.protocol = protocol;
    this.master_dip = master_dip;
    this.slave_dip = slave_dip;
    this.action = action;
    this.status = status;

    if (this.debug) {
        console.log(this.date+" ## Function: interfaces.setParams ##");
        console.log(this.date+" Interface: "+interfaces.interface);
        console.log(this.date+" Vendor: "+interfaces.vendor);
        console.log(this.date+" Model: "+interfaces.model);
        console.log(this.date+" Protocol: "+interfaces.protocol);
        console.log(this.date+" master_dip: "+interfaces.master_dip);
        console.log(this.date+" slave_dip: "+interfaces.slave_dip);
        console.log(this.date+" action: "+interfaces.action);
        console.log(this.date+" status: "+interfaces.status);
    }
}

/**
 * Get a specific interface
 * Param: Interface name (433,868,xbee)
 * Returns: all currently known data regarding this interface
 */
Interfaces.prototype.getInterface = function (interface_name) {
    var result = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];
    if (null == result) {
        throw new Error('[kraken] Interface "'+interface_name+'" not found');
    }
    return result;
}

/**
 * Retrieve all interfaces
 * Returns: array of interfaces with corresponding metadata
 */
Interfaces.prototype.getInterfaces = function () {
    interfaces = this.interfaces;

    if (null == interfaces) {
        throw new Error('[kraken] No interfaces not found');
    }
    return interfaces;
}

/**
 * Retrieve a specific vendor beneath a specific interface or all vendors if param = 'all'
 * Params: vendor-name, interface-name
 * Returns: array of vendor-data
 */
Interfaces.prototype.getVendor = function (interface_name,vendor_name) {
    var interface = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];

    if (null == interface) {
        throw new Error("[kraken] Interface '"+interface_name+"' not found");
    }
    else {
        if (vendor_name == 'all') {
            // If "all", return all vendors
            var vendor = interface.vendors;
        }
        else {
            var vendor = interface.vendors.filter(function(item) {
                return item.name == vendor_name;
            })[0];
        }

        if (null == vendor) {
            throw new Error("[kraken] Vendor '"+vendor_name+"' not found");
        }
        return vendor;
    }
    throw new Error('[kraken] Operation not possible [getVendor/'+interface_name+'/'+vendor_name+']');
}

/**
 * Retrieve a specific vendor beneath a specific interface or all vendors if param = 'all'
 * Params: vendor-name, interface-name
 * Returns: array of vendor-data
 */
Interfaces.prototype.getModel = function (interface_name,vendor_name,model_name) {
    if (this.debug) {
        console.log(this.date+" ## Function: interfaces.getModel ##");
        console.log(this.date+" Interface: "+interface_name);
        console.log(this.date+" Vendor: "+vendor_name);
        console.log(this.date+" Model: "+model_name);

    }

    var interface = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];

    if (null == interface) {
        throw new Error("[kraken] Interface '"+interface_name+"' not found");
    }
    else {
        if (vendor_name == 'all') {
            throw new Error('[kraken] Cannot deliver models for all vendors');
        }
        else {
            var vendor = interface.vendors.filter(function(item) {
                return item.name == vendor_name;
            })[0];
        }

        if (null == vendor) {
            throw new Error("[kraken] Vendor "+vendor_name+" not found");
        }
        else {
            // Get models
            if (model_name == 'all') {
                var model = vendor.models;
            }
            else {
                var model = vendor.models.filter(function(item) {
                    return item.name == model_name;
                })[0];
            }
            if (null == model) {
                throw new Error("[kraken] Model '"+model_name+"' not found");
            }
            return model;
        }  
    }
    throw new Error('[kraken] Operation not possible [getModel/'+interface_name+'/'+vendor_name+'/'+model_name+']');
}

/**
 * Generate the code message that will be sent
 * Params: master_dip (e.g. 10000), slave_dip (e.g. 11000), status (e.g. 'on' or 'off')
 * Returns: codeword
 */
Interfaces.prototype.getCodeword = function (master_dip,slave_dip,status) {
    if (this.debug) {
        console.log(this.date+" ## Function: interfaces.getCodeword ##");
        console.log(this.date+" master_dip: "+master_dip);
        console.log(this.date+" slave_dip: "+slave_dip);
        console.log(this.date+" Status: "+status);
    }

    // We will encode the given DIP combinations and the status in a so called TRI-STATE Code
    // Infos on Tri-State: http://sui77.wordpress.com/2011/04/12/163/

    // First, we check which protocol is needed since the codewords change between protocols.
    // Again, read http://sui77.wordpress.com/2011/04/12/163/ for information on that.
    // Check this for a table of devices & protocols: https://code.google.com/p/rc-switch/wiki/List_KnownDevices

    if (this.vendor == 'intertechno') {
        var master_dip = (master_dip + '').toUpperCase();
        var slave_dip = parseInt(slave_dip,10);

        var codeword = '';
        var codepart_master = '';
        var codepart_slave = '';

		if (this.model == 'par01500') {
			// Information taken form here: http://www.fhemwiki.de/wiki/Intertechno_Code_Berechnung  (REV Telecontrol)
			switch (master_dip) {
				case "A":
					codepart_master = "1FFF";
					break;
				case "B":
					codepart_master = "F1FF";
					break;
				case "C":
					codepart_master = "FF1F";
					break;
				case "D":
					codepart_master = "FFF1";
					break;
				default:
					throw new Error('[kraken] Master DIP "'+master_dip+'" not supported.');
					break;
			}

			// Append codepart_master to codeword
			codeword = codeword+codepart_master;

			// Encode Slave DIP - use parseInt to strip zeroes from slave_dip  
			switch (slave_dip) {
				case 1:
					codepart_slave = "1FF";
					break;
				case 2:
					codepart_slave = "F1F";
					break;
				case 3:
					codepart_slave = "FF1";
					break;
				default:
					throw new Error('[kraken] Slave DIP "'+slave_dip+'" not supported.');
					break;
			}
		
			// Append codepart_slave to codeword
			codeword = codeword+codepart_slave;

			// Next 2 bits are always "0FF"
			codeword = codeword+"0FF";

			// Encode status from string to trit-state format
			if (status == 'on') {
				codeword = codeword+"FF";
			}
			else if(status == 'off') {
				codeword = codeword+"00";
			}

			if (this.debug) {
				console.log(this.date+" Codeword: "+codeword);
			}
		}
		else {

			// Information taken form here: http://www.fhemwiki.de/wiki/Intertechno_Code_Berechnung  
			switch (master_dip) {
				case "A":
					codepart_master = "0000";
					break;
				case "B":
					codepart_master = "F000";
					break;
				case "C":
					codepart_master = "0F00";
					break;
				case "D":
					codepart_master = "FF00";
					break;
				case "E":
					codepart_master = "00F0";
					break;
				case "F":
					codepart_master = "F0F0";
					break;
				case "G":
					codepart_master = "0FF0";
					break;
				case "H":
					codepart_master = "FFF0";
					break;
				case "I":
					codepart_master = "000F";
					break;
				case "J":
					codepart_master = "F00F";
					break;
				case "K":
					codepart_master = "0F0F";
					break;
				case "L":
					codepart_master = "FF0F";
					break;
				case "M":
					codepart_master = "00FF";
					break;
				case "N":
					codepart_master = "F0FF";
					break;
				case "O":
					codepart_master = "0FFF";
					break;
				case "P":
					codepart_master = "FFFF";
					break;
				default:
					throw new Error('[kraken] Master DIP "'+master_dip+'" not supported.');
					break;
			}

			// Append codepart_master to codeword
			codeword = codeword+codepart_master;

			// Encode Slave DIP - use parseInt to strip zeroes from slave_dip  
			switch (slave_dip) {
				case 1:
					codepart_slave = "0000";
					break;
				case 2:
					codepart_slave = "F000";
					break;
				case 3:
					codepart_slave = "0F00";
					break;
				case 4:
					codepart_slave = "FF00";
					break;
				case 5:
					codepart_slave = "00F0";
					break;
				case 6:
					codepart_slave = "F0F0";
					break;
				case 7:
					codepart_slave = "0FF0";
					break;
				case 8:
					codepart_slave = "FFF0";
					break;
				case 9:
					codepart_slave = "000F";
					break;
				case 10:
					codepart_slave = "F00F";
					break;
				case 11:
					codepart_slave = "0F0F";
					break;
				case 12:
					codepart_slave = "FF0F";
					break;
				case 13:
					codepart_slave = "00FF";
					break;
				case 14:
					codepart_slave = "F0FF";
					break;
				case 15:
					codepart_slave = "0FFF";
					break;
				case 16:
					codepart_slave = "FFFF";
					break;
				default:
					throw new Error('[kraken] Slave DIP "'+slave_dip+'" not supported.');
					break;
			}
			
			// Append codepart_slave to codeword
			codeword = codeword+codepart_slave;

			// Next 2 bits are always "0F"
			codeword = codeword+"0F";

			// Encode status from string to trit-state format
			if (status == 'on') {
				codeword = codeword+"FF";
			}
			else if(status == 'off') {
				codeword = codeword+"F0";
			}

			if (this.debug) {
				console.log(this.date+" Codeword: "+codeword);
			}
		}

        return codeword;
    }
    else if (this.vendor == 'dario') {
        var codeword = "";
        /* Our codeword will have 21 bits
            Bit 1: Start Bit. Always 1
            Bit 2-7: Encoded SYSTEM-CODE (which is the master_dip) - 100100
            Bit 8-13: Encoded UNIT-CODE (which is the slave_dip) - 100000
            Bit 14-21: Action

            #1 EIN 00010001
            #1 AUS 00000000
            #1 HELL 00001010
            #1 DUNKEL 00011011
            #2 EIN 10010011
            #2 AUS 10000010
            #2 HELL 10001000
            #2 DUNKEL 10011001
            #3 EIN 11010010
            #3 AUS 11000011
            #3 HELL 11001001
            #3 DUNKEL 11011000
            #4 EIN 01010000
            #4 AUS 01000001
            #4 HELL 01001011
            #4 DUNKEL 01011010
            ALLE EIN 11110000
            ALLE AUS 11100001
        */

        // First Bit
        codeword = codeword+"0";

        // Encode SYSTEM_CODE from binary format to the tri-state format
        for (var i=0;i<6;i++) { 
            var cur = master_dip.charAt(i);
            if (cur == '0') {
                codeword = codeword+"F";
            }
            else {
                codeword = codeword+"0";
            }
        }

        // Encode UNIT from binary format to the tri-state format
        for (var j=0;j<6;j++) { 
            var cur = slave_dip.charAt(j);
            if (cur == '0') {
                codeword = codeword+"F";
            }
            else {
                codeword = codeword+"0";
            }
        }

        // Encode status from string to trit-state format
        // #2 EIN 10010011
        // #2 AUS 10000010
        if (status == 'on') {
            codeword = codeword+"0FF0FF00";
        }
        else if(status == 'off') {
            codeword = codeword+"0FFFFF0F";
        }

        if (this.debug) {
            console.log(this.date+" Codeword: "+codeword);
        }
        return codeword;
    }
    else {
        var codeword = "";
        /* Our codeword will have 13 bits
            Bit 1-5: Encoded SYSTEM-CODE (which is the master_dip)
            Bit 6-10: Encoded UNIT-CODE (which is the slave_dip)
            Bit 11-13: Status + Sync-Bit
        */

        // Encode SYSTEM_CODE from binary format to the tri-state format
        for (var i=0;i<5;i++) { 
            var cur = master_dip.charAt(i);
            if (cur == '0') {
                codeword = codeword+"F";
            }
            else {
                codeword = codeword+"0";
            }
        }

        // Encode UNIT from binary format to the tri-state format
        for (var j=0;j<5;j++) { 
            var cur = slave_dip.charAt(j);
            if (cur == '0') {
                codeword = codeword+"F";
            }
            else {
                codeword = codeword+"0";
            }
        }

        // Encode status from string to trit-state format
        if (status == 'on') {
            codeword = codeword+"0F";
        }
        else if(status == 'off') {
            codeword = codeword+"F0";
        }

        if (this.debug) {
            console.log(this.date+" Codeword: "+codeword);
        }
        return codeword;
    }
}

/**
 * Save a task (create or update)
 * Param: task the task to save
 */
// Interfaces.prototype.save = function (task) {
//     if (task.taskId == null || task.taskId == 0) {
//         task.taskId = this.nextId;
//         this.tasks.push(task);
//         this.nextId++;
//     } else {
//         var index = this.findIndex(task.taskId);
//         this.tasks[index] = task;
//     }

// }
/**
 * Remove a task
 * Param: id the of the task to remove
 */
// TaskRepository.prototype.remove = function (id) {
//     var index = this.findIndex(id);
//     this.tasks.splice(index, 1);
// }

/**
 * API
 */
var express = require('express');
var app = express();
var interfaces = new Interfaces();
app.configure(function () {
    // used to parse JSON object given in the body request
    app.use(express.bodyParser());
});

/**
 * HTTP GET /interfaces
 * Returns: the list of interfaces in JSON format
 */
app.get('/interfaces', function (request, response) {
    try {
        response.json({interfaces: interfaces.getInterfaces()});
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
});

/**
 * HTTP GET /discover
 * Returns: Code 200 and a "Hello" message
 */
app.get('/discover', function (request, response) {
    response.json(
        {
            "whoami":"kraken",
            "version":interfaces.version,
        }
    );
});

/**
 * HTTP GET /interfaces/:name
 * Param: :name is the unique identifier of the interface you want to retrieve
 * Returns: the interface with the specified :name in a JSON format
 * Error: 404 HTTP code if the interface doesn't exist
 */
app.get('/interfaces/:name', function (request, response) {
    var if_name = request.params.name;
    try {
        response.json(interfaces.getInterface(if_name));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});

/**
 * HTTP GET /interfaces/:interface_name/vendors/:vendor_name
 * Param: :interface_name is the unique identifier of the interface, :vendor_name the identifiere of the vendor you want to retrieve
 * Returns: the vendor with the specified :vendor_name or all vendors in a JSON format
 * Error: 404 HTTP code if the interface or the vendor doesn't exist
 */
app.get('/interfaces/:interface_name/vendors/:vendor_name', function (request, response) {
    var if_name = request.params.interface_name;
    var vendor_name = request.params.vendor_name;
    try {
        response.json(interfaces.getVendor(if_name,vendor_name));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});

/**
 * HTTP GET /interfaces/:interface_name/vendors/:vendor_name/models/:/:model_name
 * Param: :interface_name is the unique identifier of the interface, :vendor_name the identifier of the vendor whose mpodel (:model_name) you want to retrieve
 * Returns: the model with the specified :model_name or all models in a JSON format
 * Error: 404 HTTP code if the interface or the model doesn't exist
 */
app.get('/interfaces/:interface_name/vendors/:vendor_name/models/:model_name', function (request, response) {
    var if_name = request.params.interface_name;
    var vendor_name = request.params.vendor_name;
    var model_name = request.params.model_name;
    try {
        response.json(interfaces.getModel(if_name,vendor_name,model_name));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});

// TEST SUITE
app.get('/enabletransmit', function (request, response) {
    try {
        response.json(interfaces.enableTransmit(17));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});


app.get('/getcodeword', function (request, response) {
    try {
        interfaces.master_dip = "M";
        interfaces.slave_dip = "2";
        interfaces.vendor = "elro";
        interfaces.model = "ab440sc";
        interfaces.interface = "433";
        response.json(interfaces.getCodeword("10000","11110","on"));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});

app.get('/sendcode', function (request, response) {
    try {
        response.json(interfaces.sendCode("0FFFF0FFFF0F"));
    } catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
    }
    
});
// TEST SUITE END


/**
 * HTTP POST /interfaces/:interface_name/vendors/:vendor_name/models/:model_name
 * Body Param: the master_dip and slave_dip of the device you want to act on and the action you want to execute
 * Returns: 200 HTTP code
 */
app.post('/interfaces/:interface_name/vendors/:vendor_name/models/:model_name', function (request, response) {
    var device_data = request.body;
    var interface_name = request.params.interface_name;
    var vendor_name = request.params.vendor_name;
    var model_name = request.params.model_name;
    var master_dip = device_data.master_dip;
    var slave_dip = device_data.slave_dip;
    var action = device_data.action;
    var status = device_data.status;

    if (model_name == 'all' || vendor_name == 'all') {
        response.json({
            "interface_name":interface_name,
            "vendor_name":vendor_name,
            "model_name":model_name,
            "master_dip":master_dip,
            "slave_dip":slave_dip,
            "action":action,
            "status":status,
            "result":"error",
            "response":"Value 'all' for vendor or model is not valid in this context"
        });
    }

    // Determine if interface, vendor & model exist in our DB
    // If any of the control variables is false, stop!
    var interface_exists = false;
    var vendor_exists = false;
    var model_exists = false;

    try {
        interface = interfaces.getInterface(interface_name);

        interface_exists = true;

        // Check Vendor
        try {
            vendor = interfaces.getVendor(interface_name,vendor_name);

            vendor_exists = true;

            // Check Model
            try {
                model = interfaces.getModel(interface_name,vendor_name,model_name);

                model_exists = true;
            }
            catch (exception) {
                if (this.debug) {
                    console.log(this.date+" ERROR: "+exception.message);
                }
                response.send(exception.message,500);
                return;
            }
        }
        catch (exception) {
            if (this.debug) {
                console.log(this.date+" ERROR: "+exception.message);
            }
            response.send(exception.message,500);
            return;
        }
    }
    catch (exception) {
        if (this.debug) {
            console.log(this.date+" ERROR: "+exception.message);
        }
        response.send(exception.message,500);
        return;
    }
    
    // Set the values to the class variables
    interfaces.setParams(interface_name,vendor_name,model_name,'1',master_dip,slave_dip,action,status);

    // Get the Codeword
    // Currently only supports "set_status"
    var codeword = interfaces.getCodeword(interfaces.master_dip,interfaces.slave_dip,interfaces.status);

    // Execute command
    var exec = require('child_process').exec;
    var child = exec(interfaces.kraken_sendcode+" "+codeword, function (error, stdout, stderr) {
        if (error !== null) {
            response.json({
                "interface_name":interface_name,
                "vendor_name":vendor_name,
                "model_name":model_name,
                "master_dip":master_dip,
                "slave_dip":slave_dip,
                "action":action,
                "status":status,
                "result":"error",
                "response":error
            });
        }
    });

    // Success!
    response.json({
        "interface_name":interface_name,
        "vendor_name":vendor_name,
        "model_name":model_name,
        "master_dip":master_dip,
        "slave_dip":slave_dip,
        "action":action,
        "status":status,
        "result":"success"
    });
});
// /**
//  * HTTP PUT /tasks/
//  * Param: :id the unique identifier of the task you want to update
//  * Body Param: the JSON task you want to update
//  * Returns: 200 HTTP code
//  * Error: 404 HTTP code if the task doesn't exists
//  */
// app.put('/tasks/:id', function (request, response) {
//     var task = request.body;
//     var taskId = request.params.id;
//     try {
//         var persistedTask = taskRepository.find(taskId);
//         taskRepository.save({
//             taskId: persistedTask.taskId,
//             title: task.title || persistedTask.title,
//             description: task.description || persistedTask.description,
//             dueDate: task.dueDate || persistedTask.dueDate,
//             status: task.status || persistedTask.status
//         });
//         response.send(200);
//     } catch (exception) {
//         response.send(404);
//     }
// });
// /**
//  * HTTP PUT /tasks/
//  * Param: :id the unique identifier of the task you want to update
//  * Body Param: the JSON task you want to update
//  * Returns: 200 HTTP code
//  * Error: 404 HTTP code if the task doesn't exists
//  */
// app.delete('/tasks/:id', function (request, response) {
//     try {
//         taskRepository.remove(request.params.id);
//         response.send(200);
//     } catch (exeception) {
//         response.send(404);
//     }
// });

// Start the app, listen on defined port (usually 8080)
app.listen(interfaces.port); 
