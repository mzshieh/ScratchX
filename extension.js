(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.my_first_block = function(msg) {
        // Code that gets executed when the block is run
        console.log(msg);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'log %s', 'my_first_block'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MZ\'s extension', descriptor, ext);
})({});
