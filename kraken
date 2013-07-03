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
 * Retrieves vendors of a specific interface
 * Params: vendor-name, interface-name
 * Returns: array of vendor-data
 */
Interfaces.prototype.getVendors = function (interface_name) {
    var interface = this.interfaces.filter(function(item) {
        return item.name == interface_name;
    })[0];

    if (null == interface) {
        throw new Error('Interface not found');
    }
    else {
        return interface.vendors;
    }
}

/**
 * Retrieve a specific vendor beneath a specific interface
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
        var vendor = interface.vendors.filter(function(item) {
            return item.name == vendor_name;
        })[0];

        if (null == vendor) {
            throw new Error('Vendor not found');
        }
        return vendor;
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
 * Error: 404 HTTP code if the interface doesn't exists
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
 * HTTP GET /interfaces/:interface_name/vendors
 * Param: :interface_name is the unique identifier of the interface
 * Returns: all vendors corresponding to the specidifed interface in a JSON format
 * Error: 404 HTTP code if the interface doesn't exists
 */
app.get('/interfaces/:interface_name/vendors', function (request, response) {
    var if_name = request.params.interface_name;

    try {
        response.json(interfaces.getVendors(if_name));
    } catch (exeception) {
        response.send(404);
    }
    
});

/**
 * HTTP GET /interfaces/:interface_name/:vendor_name
 * Param: :interface_name is the unique identifier of the interface, :vendor_name the identifiere of the vendor you want to retrieve
 * Returns: the vendor with the specified :vendor_name in a JSON format
 * Error: 404 HTTP code if the interface or the vendor doesn't exists
 */
app.get('/interfaces/:interface_name/:vendor_name', function (request, response) {
    var if_name = request.params.interface_name;
    var vendor_name = request.params.vendor_name;
    try {
        response.json(interfaces.getVendor(if_name,vendor_name));
    } catch (exeception) {
        response.send(404);
    }
    
});

/**
 * HTTP POST /tasks/
 * Body Param: the JSON task you want to create
 * Returns: 200 HTTP code
 */
// app.post('/tasks', function (request, response) {
//     var task = request.body;
//     taskRepository.save({
//         title: task.title || 'Default title',
//         description: task.description || 'Default description',
//         dueDate: task.dueDate,
//         status: task.status || 'not completed'
//     });
//     response.send(200);
// });
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

app.listen(8080); //to port on which the express server listen