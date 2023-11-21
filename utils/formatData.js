const stations = require("../formattedStations.js");
const companies = require("../companies");
const imgurl = require("../imgurl.js")
const fs = require("fs")
const path = require('path');
const { getHeapStatistics } = require("v8");
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
  let newList = []
 let formatStations =await stations.gasstations.forEach(async (station) => {
    let sName = station.stationName
    imgurl.urls.forEach(url => {
      if (url.includes(`${sName}_`)) {
        station.imgUrl = url
        newList.push(station)
        // console.log(station)
        // return station
      } else {
        station.imgUrl = ''
        newList.push(station)
        // return station
      }
    });
    // console.log("station: ", station)
    return newList
  })
  // console.log("formattedStations", formatStations)
  // console.log("newlist: ", newList)
  return newList
  return formatStations
}


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
