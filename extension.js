(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    function _get_voices() {
        var ret = [];
        var voices = speechSynthesis.getVoices();
        if(voices.length == 0) {
            console.log('GG');
        }
        for(var i = 0; i < voices.length; i++ ) {
            ret.push(voices[i].name);
            console.log(voices.toString());
        }
        return ret;
    }

    ext.say = function(text) {
        // Code that gets executed when the block is run
        msg = new SpeechSynthesisUtterance(text);
        _get_voices();
        window.speechSynthesis.speak(msg);
    };

    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s', 'say', "Hello!"],
        ],
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
