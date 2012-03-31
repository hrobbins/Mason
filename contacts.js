// TODO:
//  * handle the case where user has more than the max-results contacts

/*
// Using: http://code.google.com/chrome/extensions/tut_oauth.html
// App access registration: https://code.google.com/apis/console/?pli=1#project:746950856328:access
// 
// also see gdata example: http://code.google.com/apis/contacts/docs/1.0/developers_guide_js.html#Interactive_Samples
// didn't work due to issue with oauth from an extension background page
// might be possible to re-jigger it to use the tab popup and local storage for the auth data method used below
*/

// use this method to avoid errors of value of 'X' not available for 'undefined'
var objval = function (o, path) {
            for (var p in path) {
                var attr = path[p];
                if (o[attr]) {
                    o = o[attr];
                } else { 
                    o = null;
                    break;
                }
            }
            return(o);
        };

var Contacts = {
    feedUrl: 'https://www.google.com/m8/feeds/contacts/default/full',
	scope: 'https://www.google.com/m8/feeds',
	app: 'mason-0.1',

    contacts: { },
    contactNames: [ ],

    getAll: function () {
			var url = Contacts.feedUrl;
			var request = {
				'method': 'GET',
				'headers': {
					'GData-Version': '3.0',
					'Content-Type': 'application/atom+xml'
				},
				'parameters': {
					'alt': 'json',
					'max-results': 5000,
				},
				// 'body': 'Data to send'
			};
		
            function callback(resp, xhr) {
                var data = JSON.parse(resp);
                $.each(data.feed.entry, function (i, t) { 
                    if (t['gd$name']) { 
                            var contact = { name: { } };
                            contact.email = objval(t, ['gd$email',0,'address']);
                            contact.name.full = objval(t, ['gd$name','gd$fullName','$t']);
                            contact.name.given = objval(t, ['gd$name','gd$givenName','$t']);
                            contact.name.family = objval(t, ['gd$name','gd$familyName','$t']);
                            // console.log("Name: " + JSON.stringify(t['gd$name'])); 
                            console.log("Name: " + JSON.stringify(contact)); 

                            // TODO: Currently two contacts with the same name will clobber each other
                            Contacts.contacts[contact.name.full] = contact;
                    } 
                });
                for (var n in Contacts.contacts) {
                    Contacts.contactNames.push(n);
                }
                // console.log(JSON.stringify(resp));
                // console.log(JSON.stringify(xhr));
            };

	        // Send: POST https://docs.google.com/feeds/default/private/full?alt=json
	        oauth.sendSignedRequest(url, callback, request);
        },
	
    init: function () {
            Contacts.getAll();
        },
};

var oauth = ChromeExOAuth.initBackgroundPage({
	  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
	  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
	  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
	  'consumer_key': 'anonymous',
	  'consumer_secret': 'anonymous',
	  'scope': Contacts.scope,
	  'app_name': Contacts.app,
	});


oauth.authorize(Contacts.init);
