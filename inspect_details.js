import puppeteer from 'puppeteer-core';

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

        // Let's scroll to benefit section first
        console.log('Scrolling to benefit section...');
        await page.evaluate(() => {
            const el = document.querySelector('.benefit-section');
            if (el) el.scrollIntoView({ block: 'start' });
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Let's inspect the opacity and other styles of elements
        console.log('Querying computed styles of individual children...');
        const details = await page.evaluate(() => {
            const getStyles = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return 'NOT FOUND';
                const computed = window.getComputedStyle(el);
                return {
                    opacity: computed.opacity,
                    visibility: computed.visibility,
                    display: computed.display,
                    color: computed.color,
                    clipPath: computed.clipPath,
                    transform: computed.transform,
                    offsetHeight: el.offsetHeight,
                    offsetWidth: el.offsetWidth,
                    innerHTML: el.innerHTML.substring(0, 100) + '...'
                };
            };

            return {
                tagline: getStyles('.benefit-tagline'),
                headline: getStyles('.benefit-headline'),
                banner: getStyles('.benefit-banner'),
                labelRow: getStyles('.benefit-labels-row'),
                labels: Array.from(document.querySelectorAll('.benefit-label')).map(el => {
                    const computed = window.getComputedStyle(el);
                    return { opacity: computed.opacity, visibility: computed.visibility, transform: computed.transform };
                }),
                discoverBtn: getStyles('.benefit-section .rounded-full.bg-charcoal'),
                badgeRow: getStyles('.benefit-badges-row'),
                badges: Array.from(document.querySelectorAll('.benefit-badge')).map(el => {
                    const computed = window.getComputedStyle(el);
                    return { opacity: computed.opacity, visibility: computed.visibility, transform: computed.transform };
                }),
                bottomText: getStyles('.benefit-bottom')
            };
        });

        console.log('Inspection details:\n', JSON.stringify(details, null, 2));

    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        await browser.close();
    }
}

run();
