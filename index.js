const express = require("express");
const app = express();
const PORT = 3000;
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const formatters = require("./utils/formatData");

const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(stealthPlugin());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;
const url = `https://fuelo.net/prices/date/${currentDate}?lang=en`;
console.log(currentDate);

let browser;

async function initializeBrowser() {
  browser = await puppeteer.launch({ headless: true });
  console.log("Browser initialized");
}

// initialize the browser when the server starts
async function browserIsStart() {
  if (!browser) {
    await initializeBrowser();
  }
}
browserIsStart();

function keepServerAlive() {
  // Your code here
  console.log("Function called every 1 minutes");
}
keepServerAlive();

setInterval(keepServerAlive, 60000);

app.get("/", async (req, res) => {
  try {
    // let browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 2080, height: 1024 });

    await page.goto(url, {
      timeout: 120000,
    });

    const selector = "tr";
    await page.waitForSelector(selector);

    const tableRowsWithData = await page.evaluate((selector) => {
      const tHEAD = document.querySelector("thead");
      let tableHeaders = Array.from(tHEAD.querySelectorAll("tr"));
      console.log("tableHeaders: ", tableHeaders);
      // console.log("tableHeaders: ",tableHeaders)
      const tableRows = document.querySelectorAll("tr");
      let nodeArray = [];

      tableRows.forEach(async (element) => {
        let formattedCompanyPrices = [];
        let companyPrices = Array.from(element.querySelectorAll("td"));

        console.log("companyPrices: ", companyPrices);
        let headers = Array.from(element.querySelectorAll("th"));

        const headersContent = headers.map((element) => {
          return element.innerText;
        });

        console.log("headersContent: ", headersContent);
        companyPrices.forEach((companyPrice) => {
          if (companyPrice.length == 0) {
            return formattedCompanyPrices.push(headersContent[i]);
          }
          formattedCompanyPrices.push(companyPrice.innerText);
        });
        nodeArray.push({ company: formattedCompanyPrices });
      });

      return nodeArray;
    }, selector);

    console.log("tableRowsWithData: ", tableRowsWithData);
    res.json({ data: tableRowsWithData });
    // console.log(tableRowsWithData);
  } catch (error) {
    browser.close();
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// let companies = []

function checkArray(array) {}

// console.log(locations.gasstations);

app.get("/formatdata_inProgress", async (req, res) => {
  let stations = await formatters.fetchStaions();
  res.send({ stations: stations });
});

app.get("/imagepaths", async (req, res) => {
  let getImagePath = await formatters.getImagePath();
  res.send({ stations: getImagePath });
});
 
app.get("/addimgurls", async (req, res) => { 
  let addimgurls = await formatters.addImageUrls();
  console.log("addimgurls :", addimgurls)
  res.send({ "station with urls": addimgurls });
});
app.listen(PORT, () => {
  console.log(`bot running on ${PORT}`);
});

// npm install && cd ./node_modules/puppeteer && npm install
// lat_max=90.38669150215206&lon_max=180&lat_min=-90&lon_min=-180&zoom=19
// let headerContent = tableHeaders.forEach(async (header) => {
//   let headers = Array.from(element.querySelectorAll("th"));
//   console.log("header: ", headers);
// });
// console.log("headerContent: ", headerContent);
