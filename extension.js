/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.detect_lang = function() {
        var voices = speechSynthesis.getVoices();
        if(voices.length == 0) {
            console.log('GG');
        }
        var ret = '';
        for(var i = 0; i < voices.length; i++ ) {
            console.log(voices[i].lang.toString()+": "+voices[i].name.toString());
            ret += voices[i].lang.toString()+',';
        }
        return ret;
    };

    ext.say = function(text) {
        // Code that gets executed when the block is run
        var msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    };

    ext.say_korean = function(text) {
        var msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ko-KR';
        var voices = speechSynthesis.getVoices();
        for(var i = 0; i < voices.length; i++) {
            if(voices[i].lang.toString() == 'ko-KR') {
                msg.voice = voices[i];
            }
        }
        window.speechSynthesis.speak(msg);
    };
    
    ext.say_lang = function(text,lang) {
        var msg = new SpeechSynthesisUtterance(text);
        msg.lang = lang;
        var voices = speechSynthesis.getVoices();
        for(var i = 0; i < voices.length; i++) {
            if(voices[i].lang.toString() == lang) {
                msg.voice = voices[i];
                window.speechSynthesis.speak(msg);
            }
        }
//        window.speechSynthesis.speak(msg);
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['r', 'detect languages', 'detect_lang'],
            [' ', 'say %s', 'say', "Hello!"],
            [' ', 'say %s in 한국의', 'say_korean', '한국의'],
            [' ', 'say %s in lang %s', 'say_lang', '한국의', 'ko-KR'],
        ],
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
