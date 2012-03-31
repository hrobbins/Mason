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

// --------------------------------------------------------------------
//  Manage Browser Tabs
// --------------------------------------------------------------------

var tabs = {
	ext_window: null,

	setup: function() {
	        chrome.windows.create( {top: 5, left: 5, focused: false, incognito: false }, function (w) { 
		            tabs.ext_window = w; 
                    chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) { });
                });
        },

};

// --------------------------------------------------------------------
//  General Methods
// --------------------------------------------------------------------

// --------------------------------------------------------------------
//  Main Extension Object
// --------------------------------------------------------------------

var mason = {
    run: function() {

        },
	
    reload: function() {
		    chrome.windows.remove(tabs.ext_window.id);
		    location.reload(true);
		},
}


// ------------------------------------------------------------
//  Run
// ------------------------------------------------------------

// mason.run();
