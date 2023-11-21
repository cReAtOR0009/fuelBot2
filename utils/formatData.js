const stations = require("../formattedStations.js");
const companies = require("../companies");
const imgurl = require("../imgurl.js")
const fs = require("fs")
const path = require('path');
const folderPath = './assets/images'

 

module.exports.addStationName = () => {
  let formattedData = [];
  stations.gasstations.forEach((station) => {
    let company = companies.companies.find(
      (comp) => comp === station.companyLogo
    );
    station.stationName = company;

    formattedData.push(arr);
  });
  return formattedData;
};

module.exports.getImagePath = () => {
  try {
      // Read the contents of the specified folder
      const files = fs.readdirSync(folderPath);

      // Filter out only image files (you can customize the extensions as needed)
      const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));

      // Create an array of relative paths
      const relativePaths = imageFiles.map(file => path.join(folderPath, file));

      return relativePaths;
  } catch (error) {
      console.error('Error reading folder:', error);
      return [];
  }
}

module.exports.addImageUrls = async () => {
  const newList = await Promise.all(stations.gasstations.map(async (station) => {
      const sName = station.stationName;
      const matchingUrl = imgurl.urls.find(url => url.includes(`${sName}_`));

      if (matchingUrl) {
          station.imgUrl = matchingUrl;
      } else {
          station.imgUrl = '';
      }

      return station;
  }));

  console.log("formatStations: ", newList);
  return newList;
};

module.exports.extractCompanies = () => {
  let companyBox = [];

  stations.gasstations.forEach((gasstation) => {
    if (companyBox.includes(gasstation.companyLogo)) {
      console.log(`${gasstation.companyLogo} exists in the array.`);
    } else {
      console.log(`${gasstation.companyLogo} does not exist in the array.`);
      companyBox.push(gasstation.companyLogo);
    }
  });
  return companyBox;
};

module.exports.fetchStaions = () => {
  return stations
}

module.exports.getStationsNumber = () => {
    let numberOfStations = stations.gasstations.length
    return numberOfStations
}
