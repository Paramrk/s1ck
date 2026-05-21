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

        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', err => console.error('BROWSER ERROR:', err));

        console.log('Navigating to https://localhost:5173...');
        await page.goto('https://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

        console.log('Waiting 5 seconds for preloader...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Let's scroll to 9600px
        console.log('Scrolling to 9600px...');
        const scrollResult = await page.evaluate(() => {
            window.scrollTo(0, 9600);
            return {
                scrollY: window.scrollY
            };
        });

        console.log('Scroll action initialized:', scrollResult);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Let's inspect the opacity and other styles of elements
        console.log('Querying computed styles of individual children...');
        const details = await page.evaluate(() => {
            const getStyles = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return 'NOT FOUND';
                const computed = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                    opacity: computed.opacity,
                    visibility: computed.visibility,
                    display: computed.display,
                    transform: computed.transform,
                    pageTop: rect.top + window.scrollY,
                    viewportTop: rect.top,
                    height: rect.height
                };
            };

            // Let's get all ScrollTriggers
            const scrollTriggers = typeof window.ScrollTrigger !== 'undefined' ? 
                window.ScrollTrigger.getAll().map(st => ({
                    trigger: st.trigger ? st.trigger.className || st.trigger.tagName : 'NONE',
                    start: st.start,
                    end: st.end,
                    progress: st.progress,
                    isActive: st.isActive,
                    scroll: st.scroll()
                })) : 'ScrollTrigger undefined on window';

            return {
                scrollY: window.scrollY,
                scrollHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight,
                scrollTriggers,
                tagline: getStyles('.benefit-tagline'),
                headline: getStyles('.benefit-headline'),
                banner: getStyles('.benefit-banner'),
                labelsRow: getStyles('.benefit-labels-row'),
                labels: Array.from(document.querySelectorAll('.benefit-label')).map(el => {
                    const computed = window.getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    return {
                        opacity: computed.opacity,
                        visibility: computed.visibility,
                        transform: computed.transform,
                        pageTop: rect.top + window.scrollY,
                        viewportTop: rect.top
                    };
                }),
                badgesRow: getStyles('.benefit-badges-row'),
                badges: Array.from(document.querySelectorAll('.benefit-badge')).map(el => {
                    const computed = window.getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    return {
                        opacity: computed.opacity,
                        visibility: computed.visibility,
                        transform: computed.transform,
                        pageTop: rect.top + window.scrollY,
                        viewportTop: rect.top
                    };
                }),
                bottomText: getStyles('.benefit-bottom')
            };
        });

        console.log('Inspection details after scrolling to 9600:\n', JSON.stringify(details, null, 2));

        // Take a screenshot
        console.log('Taking screenshot...');
        const screenshotPath = 'C:\\Users\\A\\.gemini\\antigravity-ide\\brain\\3c9c9d89-4887-424d-bd39-462e2627b76b\\scratch\\scroll_inspect_9600.png';
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        await browser.close();
    }
}

run();
