import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: [
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        console.log('Navigating to https://localhost:5173...');
        await page.goto('https://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

        console.log('Waiting 5 seconds for preloader...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Let's capture the page structure
        console.log('Inspecting elements...');
        const inspection = await page.evaluate(() => {
            const getStyles = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                const computed = window.getComputedStyle(el);
                return {
                    selector,
                    rect: {
                        top: rect.top,
                        bottom: rect.bottom,
                        left: rect.left,
                        right: rect.right,
                        width: rect.width,
                        height: rect.height
                    },
                    zIndex: computed.zIndex,
                    opacity: computed.opacity,
                    display: computed.display,
                    visibility: computed.visibility,
                    backgroundColor: computed.backgroundColor,
                    transform: computed.transform,
                    position: computed.position
                };
            };

            return {
                benefitSection: getStyles('.benefit-section'),
                container: getStyles('.benefit-section .container'),
                vdPin: getStyles('.vd-pin'),
                videoWrapper: getStyles('.video-wrapper'),
                videoBox: getStyles('.video-box'),
                bodyBg: window.getComputedStyle(document.body).backgroundColor,
                smoothContent: getStyles('#smooth-content'),
                smoothWrapper: getStyles('#smooth-wrapper')
            };
        });

        console.log('Inspection results:\n', JSON.stringify(inspection, null, 2));

        // Take a screenshot of the benefit section
        console.log('Taking screenshot...');
        const screenshotPath = 'C:\\Users\\A\\.gemini\\antigravity-ide\\brain\\3c9c9d89-4887-424d-bd39-462e2627b76b\\scratch\\benefit_inspect.png';
        
        // Let's scroll to benefit section first
        await page.evaluate(() => {
            const el = document.querySelector('.benefit-section');
            if (el) el.scrollIntoView();
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        await browser.close();
    }
}

run();
