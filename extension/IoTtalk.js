/* Modified from the ScratchX official example. */

(function(ext) {
    
    // root url
    var root_url = 'http://140.113.199.229:9999/';
    
    // flood threshold in millisecond
    var flood_threshold = 250;
    
    // Variables for preventing flood queries
//    var last_query_timestamp = 0;
//    var last_query_result = {};
    var last_query = {};
    
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
    ext.return_query = function(item, data, callback) {
        if(!(data instanceof Array) || item < 0 || item >= data.length) {
            callback(data);
        }
        else {
            callback(data[item]);
        }
    };

    // todo: consider decoupling get and trigger
    ext.iottalk_remote_get = function(item,feature,callback) {
        var timestamp = new Date().getTime();
        if(feature in last_query && timestamp-last_query[feature]['timestamp']<flood_threshold) {
            // last query should looks like:
            // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
            ext.return_query(item,last_query[feature]['result']['samples'][0][1],callback);
        }
        else {
            // trying to prevent ajax query in next flood_threshold ms
            last_query[feature]['timestamp'] = timestamp;
            /* global $ */
            $.ajax({
                url: root_url+'IoTtalk_Control_Panel/'+feature,
                dataType: 'json',
                success: function( data ) {
                    // data should looks like:
                    // {"samples":[["2016-07-17 07:42:16.763608",[255,255,0]],["2016-07-17 07:42:14.543544",[255,255,0]]]}
                    console.log(data);
                    if(!(feature in last_query && last_query[feature]['result']['samples'][0][0]==data['samples'][0][0])) {
                        // updated if not (old feature && old time stamp)
                        console.log(last_query[feature]['result']);
                        // set to false for the first time
                        lately_updated[feature] = (feature in lately_updated);
                    }
                    last_query[feature]['result']=data;
                    ext.return_query(item,data['samples'][0][1],callback);
                }
            });
        }
    };
    
    ext.iottalk_remote_get_all = function(feature,callback) {
        ext.iottalk_remote_get(-1,feature,callback);
    }
    
    // todo: improve avoiding to trigger at the opening
    ext.iottalk_updated = function(feature) {

        console.log(feature);

        if(!(feature in last_query)) {
            ext.iottalk_remote_get(-1,feature,function(){});
            return false;
        }

        console.log(feature+' is in lately_updated');
        
        if(lately_updated[feature]===true) {
            lately_updated[feature]=false;
            return true;
        }
        
        console.log(feature+' is not lately updated');

        var timestamp = new Date().getTime();
        if(timestamp-last_query[feature]['timestamp']>=flood_threshold) {
            ext.iottalk_remote_get(-1,feature,function(){});
        }
        
        return false;
    };
    
    // dynamic datatype: data. %n for numbers, %s for strings.
    ext.iottalk_remote_put = function(feature, data, callback) {
        if(new Date().getTime()-last_emit_timestamp<flood_threshold && feature in last_emit_result) {
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
            last_emit_timestamp=flood_threshold;
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
            ['R', 'get %s from Remote', 'iottalk_remote_get_all', 'Keypad1'],
            ['R', 'get item %n of %s from Remote', 'iottalk_remote_get', 0, 'Keypad1'],
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
