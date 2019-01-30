const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const globals = require('./config');

// var allAnchorsConfirmed = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function screenshot(page) {
    console.log("taking screenshot");
    const screenshot = page.screenshot({
        fullPage: true,
        type: 'png',
        path: Date.now() + '.png'
    });
};

async function evaluate(page, selector) {
    console.log("evaluating");

    let cancel = false;

    const eval = await page.evaluate(selector => {
        const anchors = document.querySelector(selector);
        const offsets = anchors.getBoundingClientRect();
        // Find out how many parents until body tag and compare bounding client rects to get minimum size;
        let elementNest = anchors;
        let smallestVisibleWidth = offsets.width;
        let smallestVisibleHeight = offsets.height;
        // let shortestDistanceTop = offsets.top;
        // let shortestDistanceLeft = offsets.left;

        while ('BODY' != elementNest.tagName) {
            if(elementNest.getBoundingClientRect().width < smallestVisibleWidth || elementNest.getBoundingClientRect().height < smallestVisibleHeight) {
                let prevBorderStyle = elementNest.style.border;
                elementNest.style.border = "thick dashed blue";
                let excludeAreaConfirm = confirm('Does that seem right?\n' + elementNest.getBoundingClientRect().width + '*' + elementNest.getBoundingClientRect().height);
                if (true === excludeAreaConfirm) {
                    smallestVisibleWidth = elementNest.getBoundingClientRect().width;
                    smallestVisibleHeight = elementNest.getBoundingClientRect().height;
                    // shortestDistanceTop = elementNest.getBoundingClientRect().top;
                    // shortestDistanceLeft = elementNest.getBoundingClientRect().left;
                    break;
                };
                elementNest.style.border = prevBorderStyle;

            };
            elementNest = elementNest.parentElement;
            if (('BODY' == elementNest) && (false == excludeAreaConfirm)) {
                console.log("Sorry, couldn't find what you were looking for");
                cancel = true;
                break;
            };
        };
        let svgContainer = document.createElement("div");
        svgContainer.setAttribute("class", "svg-container");
        svgContainer.style.position = 'absolute';
        svgContainer.style.top = 0 + "px";
        svgContainer.style.left = 0 + "px";
        var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        svg.setAttribute("width", smallestVisibleWidth) //Set svg's data
        svg.setAttribute("height", smallestVisibleHeight) //Set svg's data
        rect.setAttribute("width", "100%") //Set rect's data
        rect.setAttribute("height", "100%") //Set rect's data
        rect.setAttribute("fill", "red") //Set rect's data
        svg.appendChild(rect);
        svgContainer.appendChild(svg);
        anchors.parentElement.appendChild(svgContainer);

        return anchors;

        // The page.evaluate function should return all divs (and respective classes) that have been excluded from the screenshot ==> Or should it?

    }, selector);

    // let screenshotConfirm = confirm('Take screenshot?');
    // if (true === screenshotConfirm) {
    if (false == cancel){
        await screenshot(page);
    } else {
        console.log("couldn't take a screenshot cause it has been cancelled");
    };
    // }
};

function createSVG(anchors, width, height) {
    console.log("creating SVG");
    let svgContainer = document.createElement("div");
    svgContainer.setAttribute("class", "svg-container");
    svgContainer.style.position = 'absolute';
    svgContainer.style.top = 0 + "px";
    svgContainer.style.left = 0 + "px";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    svg.setAttribute("width", width) //Set svg's data
    svg.setAttribute("height", height) //Set svg's data
    rect.setAttribute("width", "100%") //Set rect's data
    rect.setAttribute("height", "100%") //Set rect's data
    rect.setAttribute("fill", "red") //Set rect's data
    svg.appendChild(rect);
    svgContainer.appendChild(svg);
    anchors.parentElement.appendChild(svgContainer);
    return svgContainer;
};

function gotopage(URL, viewport, headless, devtools) {
    (async () => {
        console.log("going to page");
        const browser = await puppeteer.launch({headless: headless, devtools: devtools});
        let pages = await browser.pages();
        const page = await pages[0];
        await page.setViewport(viewport);
        await page.goto(URL);

        // XXX 3. If page contains videos, sliders, ads, or anything that moves in page : there is a risk that the screenshot will be different than the last one and thus warn the user even though the page has not changed.
        // 3.1 Ask user confirmation
        // 3.1.1 Either select specific page tag and this will leave it out ===> this uses code-based comparison
        // ====> Replaces the selected tag and everything inside with a same-sized div with a light blue background. DESTRUCTIVE METHOD
        // 3.1.2 Or draw on top of page where it shouldn't take the screenshot ===> this requires imagemagick to handle the response. NON-DESTRUCTIVE METHOD
        // 3.2 Artificial intelligence ?

        // XXX Current solution : open browser at "config time" (define config time : first run of set up for screenshots), toggle off specific divs/tags for pixel match. This will draw SVGs on top of image but will not destruct code.


        // XXX 4. If a difference has been found in the images or the code, draw a red rectangle around what area (or tags) have changed
        // ====> this will require imagemagick ?
        // ====> or can I just adjust the CSS in the page itself ?

        await page.waitForSelector(globals().resultsSelector);

        evaluate(page, globals().resultsSelector);

        // await browser.close();

    })();
};

gotopage(globals().URL, globals().viewport, globals().headless, globals().devtools);
