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
                        }
                    ]
                }
            ]
        }
    ];

    // Port to listen on
    this.port = 8080;

    // GPIO17 [PIN 11 on the board]
    this.PIN = 17;

    // Default for Protocol 1 (which fits for most devices)
    this.pulseLength = 350;

    // Default for Protocol 1
    this.repeatTransmit = 10;

    // Default Protocol
    this.protocol = 1;
}
/**
 * Get a specific interface
 * Param: Interface name (433,868,xbee)
 * Returns: all currently known data regarding this interface
 */
Interfaces.prototype.getInterface = function (interface) {
    var result = this.interfaces.filter(function(item) {
        return item.name == interface;
    })[0];
    if (null == result) {
        throw new Error('Interface not found');
    }
    return result;
}

/**
 * Retrieve all interfaces
 * Returns: array of interfaces with corresponding metadata
 */
Interfaces.prototype.getInterfaces = function () {
    return this.interfaces;
}

/**
 * Retrieve a specific interface
 * Param: interface-name
 * Returns: array of vendors with corresponding metadata for this interface
 */
Interfaces.prototype.getInterface = function (interface_name) {
    var interface = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];
    if (null == interface) {
        throw new Error('Interface not found');
    }
    return interface;
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
        throw new Error('Interface not found');
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
            throw new Error('Vendor not found');
        }
        return vendor;
    }
}

/**
 * Retrieve a specific vendor beneath a specific interface or all vendors if param = 'all'
 * Params: vendor-name, interface-name
 * Returns: array of vendor-data
 */
Interfaces.prototype.getModel = function (interface_name,vendor_name,model_name) {
    var interface = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];

    if (null == interface) {
        throw new Error('Interface not found');
    }
    else {
        if (vendor_name == 'all') {
            throw new Error('Cannot deliver models for all vendors');
        }
        else {
            var vendor = interface.vendors.filter(function(item) {
                return item.name == vendor_name;
            })[0];
        }

        if (null == vendor) {
            throw new Error('Vendor not found');
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
            return model;
        }
        
    }
}

/**
 * Enable Transmit on a given GPIO PIN
 * Params: PIN
 * Returns: /
 */
Interfaces.prototype.enableTransmit = function (PIN) {
    console.log("Enable Transmit");
    var sys = require('sys');
    var exec = require('child_process').exec;

    // Write to the PIN
    var export1 = exec('echo "'+PIN+'" > /sys/class/gpio/export');
    var direciton1 = exec('echo "out" > /sys/class/gpio/gpio'+PIN+'/direction');
}

/**
 * Generate the code message that will be sent
 * Params: master_dip (e.g. 10000), slave_dip (e.g. 11000), status (e.g. 'on' or 'off')
 * Returns: codeword
 */
Interfaces.prototype.getCodeword = function (master_dip,slave_dip,status) {
    console.log("MASTER DIP (SYSTEM CODE): "+master_dip);
    console.log("SLAVE DIP (UNIT CODE): "+slave_dip);
    console.log("STATUS: "+status);
    console.log("PROTOCOL: "+this.protocol);
    // We will encode the given DIP combinations and the status in a so called TRI-STATE Code
    // Infos on ri-State: http://sui77.wordpress.com/2011/04/12/163/

    // First, we check which protocol is needed since the codewords change between protocols.
    // Again, read http://sui77.wordpress.com/2011/04/12/163/ for information on that.
    // Check this for a table of devices & protocols: https://code.google.com/p/rc-switch/wiki/List_KnownDevices

    /* Tri-State Mapping:
        0 = F
        1 = 0    
    */

    // Proto 1: Most Elro, Polling & Intertechno
    if (this.protocol == 1) {
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
                console.log("New Codeword: "+codeword);
            }
            else {
                codeword = codeword+"0";
                console.log("New Codeword: "+codeword);
            }
        }

        // Encode UNIT from binary format to the tri-state format
        for (var j=0;j<5;j++) { 
            var cur = slave_dip.charAt(j);
            if (cur == '0') {
                codeword = codeword+"F";
                console.log("New Codeword: "+codeword);
            }
            else {
                codeword = codeword+"0";
                console.log("New Codeword: "+codeword);
            }
        }

        // Encode status from string to trit-state format
        if (status == 'on') {
            codeword = codeword+"0F";
        }
        else if(status == 'off') {
            codeword = codeword+"F0";
        }

        console.log("Codeword: "+codeword);
        return codeword;
    }
}

/**
 * Send a part of the tri-state code
 * Params: code_part
 * Returns: /
 */
Interfaces.prototype.sendCodePart = function (code_part,cb) {
    // console.log("\nFunction: SEND CODE PART");
    var async = require('async');

    // console.log("Code Part: "+code_part);
    if (code_part == "0") {
        // "Send" tri-state code for 0
        // To understand what happens here, check comments on this.transmit function
        // console.log("Transmitting Tri-State for 0");
        async.series({
            one: function(callback){
                // console.log("Transmit Step 1: 1,3");
                interfaces.transmit(1,3, function() {
                    callback(null, 'one'); 
                }); 
            },
            two: function(callback){
                // console.log("Transmit Step 2: 1,3");
                interfaces.transmit(1,3, function() {
                    callback(null, 'two');
                });
            }
        },
        // optional callback
        function(err, results){
            // console.log("Code part sent successfully");
            cb();
        });
        
    }
    else if (code_part == "F") {
        // console.log("Transmitting Tri-State for F");

        async.series({
            one: function(callback){
                // console.log("Transmit Step 1: 1,3");
                interfaces.transmit(1,3, function() {
                    callback(null, 'one');
                });
            },
            tow: function(callback){
                // console.log("Transmit Step 1: 3,1");
                interfaces.transmit(3,1, function() {
                    callback(null, 'two');
                }); 
            }
        },
        // optional callback
        function(err, results){
            // console.log("Code part sent successfully");
            cb();
        });
    }
    else if (code_part == "1") {
        // console.log("Transmitting Tri-State for 1");

        async.series({
            one: function(callback){
                // console.log("Transmit Step 2: 3,1");
                interfaces.transmit(3,1, function() {
                    callback(null, 'one');
                });
            },
            two: function(callback){
                // console.log("Transmit Step 2: 3,1");
                interfaces.transmit(3,1,function() {
                    callback(null, 'two');
                });
            }
        },
        // optional callback
        function(err, results){
            // console.log("Code Part sent successfully");
            cb();
        });
    }
}

/**
 * Send a Sync Message
 * Params: /
 * Returns: /
 */
Interfaces.prototype.sendSync = function (cb) {
    // console.log("\nFunction: SEND SYNC");
    // Send a sync bit after that
    if (this.protocol == 1) {
        // console.log("Transmitting Sync for Protocol 1");
        // console.log("Transmit: 1,31");
        interfaces.transmit(1,31);
        cb();
    }
    else if (this.protocol == 2) {
        // console.log("Transmitting Sync for Protocol 2");
        // console.log("Transmit: 1,10");
        interfaces.transmit(1,10);
        cb();
    }
    else if (this.protocol == 3) {
        // console.log("Transmitting Sync for Protocol 3");
        // console.log("Transmit: 1,71");
        interfaces.transmit(1,71);
        cb();
    }
}

/**
 * Send the tri-state encoded message
 * Params: codeword (generated by this.getCodeword)
 * Returns: /
 */
Interfaces.prototype.sendTriState = function (codeword,cb) {
    // console.log("\nFunction: SEND TRISTATE");
    var code_arr = codeword.split('');
    // console.log("Code Array: "+code_arr);

    var async = require('async');
    
    async.eachSeries(code_arr, interfaces.sendCodePart, function(err){
        interfaces.sendSync;
        // console.log("Code sent; Sending Sync;");
    });
    cb();
}

/**
 * Send the tri-state encoded message n times
 * Params: codeword (generated by this.getCodeword)
 * Returns: /
 */
Interfaces.prototype.sendCode = function (codeword) {
    // console.log("\nFunction: SEND CODE");
    // console.log("CODEWORD: "+codeword);
    // console.log("REPEATS: "+this.repeatTransmit);
    var transmit_ct = this.repeatTransmit;

    // This function "sends" the given codewordm which means it calls sub-functions which change the state and value of the underlying GPIO Pin
    // The transmit is repeated n times according to the protocol (this.repeatTransmit)

    // Set the PIN as Export
    var enableTransmit = this.enableTransmit(this.PIN);
  

    var count = 0;
    var async = require('async');
    async.whilst(
        function () { return count < transmit_ct; },
        function (callback) {
            console.log("Sending Codeword. Run "+count);
            // console.log("To run: "+(transmit_ct-count));
            count++;
            interfaces.sendTriState(codeword,callback);
        },
        function (err) {
            // console.log("Tri-State sent "+count+" times");
        }
    );
}

/**
 * Transmit - change the state of the GPIO PIN
 * Params: high pulses count, low pulses count
 * Returns: /
 */
Interfaces.prototype.transmit = function (highPulses,lowPulses,cb) {
    // console.log("\nFunction: TRANSMIT");
    // console.log("HIGH: "+highPulses);
    // console.log("LOW: "+lowPulses);
    // console.log("PulseLength: "+this.pulseLength);
    var sleep_time_high = this.pulseLength * highPulses; 
    var sleep_time_low = this.pulseLength * lowPulses;

    /*
    "0" Bit => 1/8 cycles on, 3/8 cycles off, 1/8 cycles An, 3/8 cycles off   -...-...
    "1" Bit => 3/8 cycles on, 1/8 cycles off, 3/8 cycles An, 1/8 cycles off   ---.---.
    "F" Bit => 1/8 cycles on, 3/8 cycles off, 3/8 cycles An, 1/8 cycles off   -...---.
    "S" Bit => 1/8 cycles on, 31/8 cycles off -...............................
    */
    var async = require('async');
    async.series({
        one: function(callback){
            // console.log("Step 1: Writing HIGH Sate to PIN");
            interfaces.writePIN(interfaces.PIN, 1, function() {
                callback(null, 'one');
            });
        },
        two: function(callback){
            // console.log("Step 2: Delay: "+sleep_time_high);
            interfaces.delay(sleep_time_high, function() {
                callback(null, 'two');
            }); 
        },
        three: function(callback){
            // console.log("Step 3: Writing LOW Sate to PIN");
            interfaces.writePIN(interfaces.PIN, 0, function() {
                callback(null, 'three');
            });
        },
        four: function(callback){
            // console.log("Step 4: Delay: "+sleep_time_high);
            interfaces.delay(sleep_time_low, function() {
                callback(null, 'four');
            }); 
        },
        five: function(callback){
            // console.log("Step 4: Delay: "+sleep_time_high);
            interfaces.delay(sleep_time_low, function() {
                callback(null, 'four');
            }); 
        }
    },
    // optional callback
    function(err, results){
        // console.log("Transmit successful");
    });   

    cb();
}

/**
 * Set PIN value - change the state of the GPIO PIN
 * Params: PIN to change and VALUE to write
 * Returns: /
 */
Interfaces.prototype.writePIN = function (PIN,value,callback) {
    // console.log("\nFunction: Write PIN");
    // console.log("PIN: "+PIN);
    // console.log("value: "+value);
    
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) { }
    exec('echo "'+value+'" > /sys/class/gpio/gpio'+PIN+'/value', puts);

    callback();
}

/**
 * Just wait for given amount of ms
 * Params: microseconds
 * Returns: /
 */
Interfaces.prototype.delay = function (microseconds,callback) {
    var sleep = require('sleep');
    // console.log("\nFunction: delay");
    // console.log("DELAY: "+microseconds);
    
    var e = new Date().getTime() + (microseconds / 1000);
    console.log("First date: "+e)

    var async = require('async');

    async.whilst(
        function () { return new Date().getTime() < e; },
        function (callback) {
            console.log("While Date: "+e);
            callback(null,1)
        },
        function (err) {
        }
    );

    // sleep.usleep(microseconds);
    callback();
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
    response.json({interfaces: interfaces.getInterfaces()});
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
    } catch (exeception) {
        response.send(404);
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
    } catch (exeception) {
        response.send(404);
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
    } catch (exeception) {
        response.send(404);
    }
    
});

// TEST SUITE
app.get('/enabletransmit', function (request, response) {
    try {
        response.json(interfaces.enableTransmit(17));
    } catch (exeception) {
        response.send(404);
    }
    
});


app.get('/getcodeword', function (request, response) {
    try {
        response.json(interfaces.getCodeword("10000","10000","on"));
    } catch (exeception) {
        response.send(404);
    }
    
});

app.get('/sendcode', function (request, response) {
    try {
        response.json(interfaces.sendCode("0FFFF0FFFF0F"));
    } catch (exeception) {
        response.send(404);
    }
    
});
// TEST SUITE END


/**
 * HTTP POST /tasks/
 * Body Param: the JSON task you want to create
 * Returns: 200 HTTP code
 */
app.post('/interfaces/:interface_name/vendors/:vendor_name/models/:model_name', function (request, response) {
    var device_data = request.body;
    response.json(device_data);
    console.log(device_data.master_dip,device_data.slave_dip);

    // taskRepository.save({
    //     title: task.title || 'Default title',
    //     description: task.description || 'Default description',
    //     dueDate: task.dueDate,
    //     status: task.status || 'not completed'
    // });
    // response.send(200);
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

app.listen(interfaces.port); //to port on which the express server listen
