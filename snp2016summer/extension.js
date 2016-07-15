/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    // The voices
    var voice = null;
    var voice_count = 0;
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if(voice_count == 0) {
            /* global speechSynthesis */
            var voices = speechSynthesis.getVoices();
            voice_count = voices.length;
            voice = {};
            for(var i = 0; i < voices.length; i++) {
                voice[voices[i].lang.toString()] = voices[i];
            }
            console.log(voice.toString());
            return {status: 1, msg: 'Not ready'};
        }
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text) {
        /* global SpeechSynthesisUtterance */
        var msg = new SpeechSynthesisUtterance(text);
        if('en-US' in voice) {
            msg.voice = voice['en-US'];
        }
        window.speechSynthesis.speak(msg);
    };

    ext.say_zh = function(text) {
        if('zh-TW' in voice) {
            /* global SpeechSynthesisUtterance */
            var msg = new SpeechSynthesisUtterance(text);
            msg.voice = voice['zh-TW'];
            window.speechSynthesis.speak(msg);
        }
    };
    
    ext.say_lang = function(text,lang) {
        if(lang in voice) {
            /* global SpeechSynthesisUtterance */
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
            [' ', '說%s', 'say_zh', '中文'],
            [' ', 'say %s in lang %s', 'say_lang', '程式設計', 'zh-TW'],
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
