"use server"

import puppeteer from 'puppeteer';

export async function scrapeWazePage(url: string) {
    console.log('מתחיל את התהליך...');
    console.log(`פותח את הדף: ${url}`);

    // הפעלת דפדפן
    const browser = await puppeteer.launch({
        headless: true, // שימוש ב-headless mode החדש
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // פתיחת דף חדש
        const page = await browser.newPage();

        // הגדרת זמן המתנה ארוך יותר (30 שניות)
        page.setDefaultNavigationTimeout(30000);

        // ניווט לדף הרצוי
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('הדף נטען בהצלחה');

        // המתנה נוספת כדי לוודא שכל האלמנטים טעונים
        await page.waitForSelector('h1.wm-poi-name-and-address__name', { timeout: 10000 })
            .catch(() => console.log('לא נמצא הסלקטור בזמן ההמתנה - ממשיך בכל מקרה'));

        // שליפת הטקסט מהאלמנט
        const poiName = await page.evaluate(() => {
            const element = document.querySelector('h1.wm-poi-name-and-address__name');
            return element ? element.innerHTML : 'לא נמצא אלמנט התואם לסלקטור';
        });

        console.log('התוכן שנשלף:', poiName);
        return poiName;

    } catch (error) {
        console.error('אירעה שגיאה במהלך התהליך:', error);
        return null;
    } finally {
        // סגירת הדפדפן
        await browser.close();
        console.log('הדפדפן נסגר');
    }
}
