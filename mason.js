// TODO:


var show = { 
        global: false,
        // debug: true,
        debug: false,
        warnings: true,
        errors: true,
    };

// --------------------------------------------------------------------
//  options.html Settings
// --------------------------------------------------------------------

var settings = {

    };

// --------------------------------------------------------------------
//  Global Utils
// --------------------------------------------------------------------

var Utils = {
    log: function(msg, test) {
            if (show.global && (typeof(test) == "undefined" || test)) {
                console.log(msg);
            }
        },
    };
	
// --------------------------------------------------------------------
//  Message Handling
// --------------------------------------------------------------------

  
function portMsgHandler(port) {
	port.onMessage.addListener(function(msg) {
        var resp = { };
        console.log("Recieved Message: " + JSON.stringify(msg));
        if (msg.data.contacts) {
            console.log("Sending contacts: " + JSON.stringify(Contacts.contactNames));
            resp.contacts = Contacts.contactNames;
        }
        resp.ok = true;
        resp.num = msg.num;
        port.postMessage(resp);
	});
}

chrome.extension.onConnect.addListener(portMsgHandler);
chrome.extension.onConnectExternal.addListener(portMsgHandler); // Handle messages from other extensions

