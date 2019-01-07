function globals() {
    return {
        // XXX 1. Get URL to take screenshot
        URL : "http://lucasbugnazet.com",
        // XXX 2. Get viewport width
        // height doesn't matter since we will take a full size screenshot
        viewport : {width: 1920, height: 1080},
        resultsSelector : '#heroVideo',
        headless : false,
        devtools : true
    };
};

module.exports = globals;
