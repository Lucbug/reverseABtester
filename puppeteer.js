const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// XXX 1. Get URL to take screenshot
let URL = "http://lucasbugnazet.com";

// XXX 2. Get viewport width
// height doesn't matter since we will take a full size screenshot
let viewport = {width: 1080, height :1};

function takescreenshot(URL, viewport) {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport(viewport);
        await page.goto(URL);

        // XXX 3. If page contains videos, sliders, ads, or anything that moves in page : there is a risk that the screenshot will be different than the last one and thus warn the user even though the page has not changed.
        // 3.1 Ask user confirmation
        // 3.1.1 Either select specific page tag and this will leave it out ===> this uses code-based comparison
            // ====> Replaces the selected tag and everything inside with a same-sized div with a light blue background. DESTRUCTIVE METHOD
        // 3.1.2 Or draw on top of page where it shouldn't take the screenshot ===> this requires imagemagick to handle the response. NON-DESTRUCTIVE METHOD
        // 3.2 Artificial intelligence ?

        // XXX 4. If a difference has been found in the images or the code, draw a red rectangle around what area (or tags) have changed
        // ====> this will require imagemagick ?
        // ====> or can I just adjust the CSS in the page itself ?

        const screenshot = await page.screenshot({
            fullPage: true,
            type: 'png',
            path: Date.now() + '.png'
        });

        await browser.close();
    })();
}

takescreenshot(URL, viewport);
