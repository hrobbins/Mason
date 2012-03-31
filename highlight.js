
$.fn.replaceText = function( search, replace, text_only ) { 
    return this.each(function(){
      var node = this.firstChild,
        val,
        new_val,
        remove = []; 
      if ( node ) { 
        do {
          if ( node.nodeType === 3 ) { 
            val = node.nodeValue;
            new_val = val.replace( search, replace );
            if ( new_val !== val ) { 
              if ( !text_only && /</.test( new_val ) ) { 
                $(node).before( new_val );
                remove.push( node );
              } else {
                node.nodeValue = new_val;
              }   
            }   
          }   
        } while ( node = node.nextSibling );
      }   
      remove.length && $(remove).remove();
    }); 
  };  


// turn all names into jquery searches
// then highlight the names
var highlight_contacts = function (contacts) {
        console.log("Replacing Contacts");
        $.each(contacts, function (i,v) {
                v = v.trim();
                var last = v.replace(/^.*\s+/, "");
                console.log("Searching for: '" + last + "'");
                var re_str = v.replace(" ", '\\s+');
                var re = new RegExp(re_str, "gi");
                $(":contains('" + last + "')").each( function () { 
                         console.log("Replacing: " + v + " using: " + re);
                         $(this).replaceText(re, "<span style='background-color:yellow'>" + v + "</span>"); 
                    });
            });
    };


var port = chrome.extension.connect({name: "mason"});
port.onMessage.addListener(function(msg) {
        console.log("Message: " + JSON.stringify(msg));
        if (msg.ok) { console.log("Recieved ok for message number: " + msg.num); }
        else if (msg.error) { } 

        if (msg.contacts) { highlight_contacts(msg.contacts); } 
    }); 

var msg_num = 1;
var sendMessage = function(data) {
        var msg = { };
        msg.data = data;
        msg.num = msg_num;
        msg_num++;
        port.postMessage(msg);
        console.log("Sending message: " + msg.num + ": " + JSON.stringify(data));
    };  


sendMessage({ 'contacts': true });
