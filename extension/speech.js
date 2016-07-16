/* Modified from the following extension.
/**********************************************************************
   Extension demonstrating a simple version of the Text to Speech block
   Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014
**********************************************************************/

(function(ext) {
    
    // The voices
    /* global speechSynthesis */
    var voice = {};
    var voice_count = 0;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        // I am not sure how to initialize the extension.
        // Check if voices are initialized
        if(voice_count == 0) {
            var voices = speechSynthesis.getVoices();
            voice_count = voices.length;
            for(var i = 0; i < voice_count; i++) {
                voice[voices[i].lang.toString()] = voices[i];
            }
            console.log(voice);
            return {status: 1, msg: 'No voices detected'};
        }
        return {status: 2, msg: 'Ready'};
    };

    ext.say = function(text,callback) {
        /* global SpeechSynthesisUtterance */
        var msg = new SpeechSynthesisUtterance(text);
        if('en-US' in voice) {
            msg.voice = voice['en-US'];
        }
        // speak even there is no English support
        // I am not sure what will happen if the browser has no voices
        window.speechSynthesis.speak(msg);
        msg.onend = function(event) {
            callback();
        };
    };

    ext.say_lang_rate_pitch_vol = function(text,lang,rate,pitch,vol,callback) {
        // if language is supported, then say it
        if(lang in voice) {
            /* global SpeechSynthesisUtterance */
            var msg = new SpeechSynthesisUtterance(text);
            msg.voice = voice[lang];
            msg.rate = rate;
            msg.pitch = pitch;
            msg.volume = vol;
            window.speechSynthesis.speak(msg);
            
            // fire the callback when msg ends
            msg.onend = function(event) {
                callback();
            };
        }
        else // otherwise ignore the command
        {
            callback();
        }
    };

    ext.say_lang_rate = function(text,lang,rate,callback) {
        ext.say_lang_rate_pitch_vol(text,lang,rate,1.0,1.0,callback);
    };

    ext.say_lang = function(text,lang,callback) {
        ext.say_lang_rate(text,lang,1.0,callback);
    };

    ext.say_zh = function(text,callback) {
        ext.say_lang_rate(text,'zh-TW',1.0,callback);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'say %s', 'say', "Hello!"],
            ['w', '說%s', 'say_zh', '中文'],
            ['w', 'say %s in lang %s', 'say_lang', '程式設計', 'zh-TW'],
            ['w', 'say %s in lang %s at rate %n', 'say_lang_rate', '程式設計', 'zh-TW', 1],
            ['w', 'say %s in lang %s at rate %n at pitch %n of volume %n', 'say_lang_rate_pitch_vol', '程式設計', 'zh-TW', 1, 1, 1],
        ],
    };

    // Register the extension
    /* global ScratchExtensions */
    ScratchExtensions.register('Speech synthesis', descriptor, ext);
})({});
