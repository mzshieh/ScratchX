/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    // The voices
    var voice = null;
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if(voice == null) {
            var voices = speechSynthesis.getVoices();
            voice = {};
            for(var i = 0; i < voices.length; i++) {
                voice[voices[i].lang.toString()] = voice[i];
            }
            console.log(voice.toString());
            return {status: 1, msg: 'Not ready'};
        }
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text) {
        // Code that gets executed when the block is run
        var msg = new SpeechSynthesisUtterance(text);
        if('en-US' in voice) {
            msg.voice = voice['en-US'];
        }
        window.speechSynthesis.speak(msg);
    };

    ext.say_korean = function(text) {
        if('ko-KR' in voice) {
            var msg = new SpeechSynthesisUtterance(text);
            msg.voice = voice['ko-KR'];
            window.speechSynthesis.speak(msg);
        }
    };
    
    ext.say_lang = function(text,lang) {
        if(lang in voice) {
            var msg = new SpeechSynthesisUtterance(text);
            msg.voice = voice[lang];
            window.speechSynthesis.speak(msg);
        }
    };
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'say %s', 'say', "Hello!"],
            [' ', 'say %s in 한국의', 'say_korean', '한국의'],
            [' ', 'say %s in lang %s', 'say_lang', '說中文', 'zh-TW'],
        ],
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
