const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const sleep = require('util').promisify(setTimeout);

// XXX 1. Get URL to take screenshot
let URL = "http://lucasbugnazet.com";

// XXX 2. Get viewport width
// height doesn't matter since we will take a full size screenshot
let viewport = {width: 1920, height: 1080};
var wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function delay(timeout) {
    return wait(timeout).then(() => console.log('waited for ' + timeout + ' ms'));
};

const delay2 = async (timeout) => {
  await wait(timeout);
  console.log('waited for ' + timeout + ' ms');
};

function gotopage(URL, viewport) {
    (async () => {
        const browser = await puppeteer.launch({headless: false, devtools: true});
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

        const resultsSelector = '#heroVideo';
        await page.waitForSelector(resultsSelector);

        const eval = await page.evaluate(resultsSelector => {
            delay(5000);
            const anchors = document.querySelector(resultsSelector);
            // console.log(anchors);
            const offsets = anchors.getClientRects()[0];
            console.log(offsets);
            console.log(anchors.getBoundingClientRect());
            console.log(anchors.getBoundingClientRect());
            let svgContainer = document.createElement("div");
            svgContainer.setAttribute("class", "svg-container");
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = offsets.top + "px";
            svgContainer.style.left = offsets.left + "px";
            svgContainer.style.zIndex = 999999999999999999;
            var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            svg.setAttribute("width", offsets.width) //Set svg's data
            svg.setAttribute("height", offsets.height) //Set svg's data
            rect.setAttribute("width", "100%") //Set rect's data
            rect.setAttribute("height", "100%") //Set rect's data
            rect.setAttribute("fill", "red") //Set rect's data
            svg.appendChild(rect);
            svgContainer.appendChild(svg);
            document.body.appendChild(svgContainer);

            return anchors;
        }, resultsSelector);

        // const screenshot = await page.screenshot({
        //     fullPage: true,
        //     type: 'png',
        //     path: Date.now() + '.png'
        // });

        // await browser.close();

    })();
};

gotopage(URL, viewport);
