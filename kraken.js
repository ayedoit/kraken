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

    // Values that will be set as soon as a device has been chosen
    this.master_dip = "";
    this.slave_dip = "";
    this.vendor = "";
    this.model = "";
    this.interface = "";
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
 * Generate the code message that will be sent
 * Params: master_dip (e.g. 10000), slave_dip (e.g. 11000), status (e.g. 'on' or 'off')
 * Returns: codeword
 */
Interfaces.prototype.getCodeword = function (master_dip,slave_dip,status) {
    console.log("MASTER DIP (SYSTEM CODE): "+master_dip);
    console.log("SLAVE DIP (UNIT CODE): "+slave_dip);
    console.log("STATUS: "+status);
    console.log("PROTOCOL: "+this.protocol);
    console.log("VENDOR: "+this.vendor);
    console.log("MODEL: "+this.model);
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
        if (this.vendor == 'elro' || this.vendor == 'pollin') {
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
        else if (this.vendor == 'intertechno') {
            var master_dip = (master_dip + '').toUpperCase();
            var slave_dip = parseInt(slave_dip,10);

            console.log("Slave DIP: "+slave_dip);
            console.log("Master DIP: "+master_dip);

            var codeword = '';
            var codepart_master = '';
            var codepart_slave = '';
            console.log("Vendor: Intertechno");

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
                throw new Error('Master DIP '+master_dip+' not supported.');
                break;
            }

            console.log("Codepart Master: "+codepart_master);

            // Append codepart_master to codeword
            codeword = codeword+codepart_master;

            console.log("Codeword: "+codeword);

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
                throw new Error('Slave DIP '+slave_dip+' not supported.');
                break;
            }

            console.log("Codepart Slave: "+codepart_slave);
            
            // Append codepart_slave to codeword
            codeword = codeword+codepart_slave;

            console.log("Codeword: "+codeword);

            // Next 2 bits are always "0F"
            codeword = codeword+"0F";
            console.log("Codeword: "+codeword);

            // Encode status from string to trit-state format
            if (status == 'on') {
                codeword = codeword+"FF";
            }
            else if(status == 'off') {
                codeword = codeword+"F0";
            }

            console.log("Codeword: "+codeword);
            return codeword;
        }
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
        interfaces.master_dip = "M";
        interfaces.slave_dip = "2";
        interfaces.vendor = "elro";
        interfaces.model = "ab440sc";
        interfaces.interface = "433";
        response.json(interfaces.getCodeword("10000","11110","on"));
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
