
const puppeteer = require('puppeteer');
const fs = require('fs');
const companies = require("../companies")

let browser

async function initializeBrowser() {
  browser = await puppeteer.launch({ headless: false });
  console.log("Browser initialized");
}

// initialize the browser when the server starts
// async function browserIsStart() {
//   try {
    
//     if (!browser) {
//       await initializeBrowser();
//     } else {
  
//     }

//   } catch (error) {
//     throw new Error(error)
//   }
// }
// browserIsStart();

async function googleImageSearchAndSave(query) {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    // Navigate to Google Images
    await page.goto('https://www.google.com/imghp');

    // Type the search query in the input field
    // await page.type('input[name="q"]', query);
    await page.type("textarea", `${query+" fuel company logo"}`);

    // Press Enter to perform the search
    await page.keyboard.press('Enter');

    // Wait for the results page to load
    await page.waitForSelector('.rg_i', { timeout: 60000 });

    // Extract the URL of the first image result
    const imageUrl = await page.evaluate(() => {
        const firstImage = document.querySelector('.rg_i');
        return firstImage ? firstImage.getAttribute('src') : null;
    });
  
    // If an image URL is found, save it to a file
    if (imageUrl) {
        const imageBuffer = await page.goto(imageUrl);
        const buff =await imageBuffer.buffer()
        console.log(imageBuffer)
        // let name =await query.replace(/\s/g, '_')
        fs.writeFileSync(`${query.replace(/\s/g, '_')}_image.png`, buff);
        console.log(`Image for "${query}" saved successfully.`);
    } else {
        console.log(`No image found for "${query}".`);
    }

    // Close the browser
    await browser.close();
}

// Example array of search terms
const searchTerms =companies.companies;

// Loop through the array and perform image search for each term
searchTerms.forEach(async (term) => {
    await googleImageSearchAndSave(term);
});
