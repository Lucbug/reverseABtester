const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// XXX 1. Get URL to take screenshot
let URL = "http://lucasbugnazet.com";

// XXX 2. Get viewport width
// height doesn't matter since we will take a full size screenshot
let viewport = {width: 1920, height: 1080};
// let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

function isAsync(fn) {
    console.log(fn.constructor.name);
   if(fn.constructor.name === 'AsyncFunction') {
       console.log('Async');
       return true;
   }
};

function gotopage(URL, viewport) {
    (async () => {
        const browser = await puppeteer.launch({headless: false, devtools: true});
        let pages = await browser.pages();
        const page = await pages[0];
        // await page.setViewport(viewport);
        await page.goto(URL);

        await page.evaluate(() => {
            console.log('start');
            console.time('delay');
            // await delay(3000);
            console.timeEnd('delay');
        });

        await browser.close();
    })();
};

gotopage(URL, viewport);
isAsync(gotopage);
