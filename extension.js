(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text) {
        // Code that gets executed when the block is run
        msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    };
    
    function _get_voices() {
        var ret = ['default'];
        var voices = speechSynthesis.getVoices();
        
        for(var i = 0; i < voices.length; i++ ) {
            ret.push(voices[i].name);
            console.log(voices.toString());
        }
        return ret;
    }
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s in %m.voices', 'say', "Hello!", 'default'],
        ],
        menus: {
            voices: _get_voices(),
        },
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
