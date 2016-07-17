/* Modified from the ScratchX official example. */

(function(ext) {
    
    // root url
    var root_url = 'http://140.113.199.200:9999/';
    
    // Variables for preventing flood queries
    var last_query_timestamp = 0;
    var last_query_result = {};
    
    // Variables for preventing flood emission
    var last_emit_timestamp = 0;
    var last_emit_result = {};
    
    // Variables for event trigger
    var lately_updated = {};

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // On a single element array, return the only element
    // otherwise, return the whole list
    ext.return_query = function(data, callback) {
        if(!(data instanceof Array) || data.length !=1) {
            callback(data);
        }
        else {
            callback(data[0]);
        }
    };

    ext.iottalk_remote_get = function(feature,callback) {
        if(new Date().getTime()-last_query_timestamp<250 && feature in last_query_result) {
            // last query should looks like:
            // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
            ext.return_query(last_query_result[feature]['samples'][0][1],callback);
        }
        else {
            /* global $ */
            $.ajax({
                url: root_url+'IoTtalk_Control_Panel/'+feature,
                dataType: 'json',
                success: function( data ) {
                    // data should looks like:
                    // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
                    console.log(data);
                    if(last_query_result[feature]!=data) {
                        lately_updated[feature] = true;
                    }
                    last_query_result[feature]=data;
                    last_query_timestamp = new Date().getTime();
                    ext.return_query(data['samples'][0][1],callback);
                }
            });
        }
    };
    
    ext.iottalk_updated = function(feature) {
        if(!(feature in lately_updated)) {
            return false;
        }
        if(new Date().getTime()-last_query_timestamp>=250) {
            ext.iottalk_remote_get(feature, function(){});
        }
        if(lately_updated[feature]===true)
        {
            lately_updated[feature]=false;
            return true;
        }
        return false;
    };
    
    ext.iottalk_remote_put = function(feature, data, callback) {
        if(new Date().getTime()-last_emit_timestamp<250 && feature in last_emit_result) {
            callback();
            return;
        }
        if (!(data instanceof Array)) {
            data = [data];
        }
        $.ajax({
            'url': root_url+'IoTtalk_Control_Panel/'+ feature,
            'method': 'PUT',
            'contentType': 'application/json',
            'data': JSON.stringify({'data': data}),
        }).done(function (msg) {
            console.log('Successed: '+ msg);
            last_emit_timestamp=250;
            last_emit_result[feature]=data;
            callback();
        }).fail(function (msg) {
            console.log('failed: '+ msg.status +','+ msg.responseText);
            callback();
        });
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['R', 'get %s from Remote', 'iottalk_remote_get', 'Keypad1'],
            // emit string
            // ['w', 'Remote %s emit %s', 'iottalk_remote_put', 'Keypad1', '7'],
            // emit number
            ['w', 'Remote %s emits %n', 'iottalk_remote_put', 'Keypad1', 6],
            ['h', 'Remote %s updated', 'iottalk_updated', 'Keypad1'],
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('IoTtalk', descriptor, ext);
})({});
