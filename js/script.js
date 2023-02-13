let searchButton = document.getElementById("searchButton");
let searchCityNameEl = document.getElementById("searchCityName");
let searchCityDateEl = document.getElementById("searchCityDate");
let searchCityIconEl = document.getElementById("searchCityIcon");
let forecastDataEl = document.getElementById("forecastData");
let searchedCityWeatherInfoTempEl = document.getElementById(
  "searchedCityWeatherInfoTemp"
);
let searchedCityWeatherInfoWindlEl = document.getElementById(
  "searchedCityWeatherInfoWind"
);
let searchedCityWeatherInfoHumidityEl = document.getElementById(
  "searchedCityWeatherInfoHumidity"
);
let searchHistoryEl = document.getElementById("searchHistory");
var searchInput = document.getElementById("searchInput");
let apiKey = "8c58edb78f117bfdda94accb6e962b0f";
var storedHistory = localStorage.getItem("history") ?? ""; //if the local storage is null giving the variable an empty string to process
var storedHistoryList = storedHistory.split(","); //spliting the string with , to store the data in the list

//this for loop runs through the history search, creates search element and renders data
for (var i = 1; i < storedHistoryList.length; i++) {
  let searchTileEl = document.createElement("div");
  searchTileEl.className =
    "searchTile mt-3 p-2 w-[15rem] border rounded-md bg-gray-400 text-gray-800 cursor-pointer text-center text-lg font-bold  hover:bg-gray-500 hover:text-white"; //styling element

  searchTileEl.textContent = storedHistoryList[i];
  searchHistoryEl.appendChild(searchTileEl);
}
//this function fetches API and getting latitude and longitude
function runAPI() {
  var searchedValue = searchInput.value;
  setupSearchedHistory(searchedValue);
  getLatLonValue(searchedValue).then(function (latlonstring) {
    let requestURL = `https://api.openweathermap.org/data/2.5/forecast?${latlonstring}&appid=${apiKey}`;
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //console.log(data.list[0]);
        var mainData = data.list[0];
        searchCityNameEl.textContent = data.city.name;
        var date = new Date(mainData.dt * 1000).toLocaleDateString("en-US");
        searchCityDateEl.textContent = "(" + date + ")";
        var iconcode = mainData.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";
        searchCityIconEl.setAttribute("src", iconURL);
        searchedCityWeatherInfoTempEl.textContent =
          "Temp: " + Math.round(mainData.main.temp - 273.15) + "°C";
        searchedCityWeatherInfoWindlEl.textContent =
          "Wind: " + mainData.wind.speed + " MPH";
        searchedCityWeatherInfoHumidityEl.textContent =
          "Humidity: " + mainData.main.humidity + " %";

        for (var i = 1; i < 6; i++) {
          let forecastTileEl = document.createElement("div");
          forecastTileEl.className =
            "forecastTile  flex flex-col space-y-4 pl-2 pt-1 pb-2 text-2xl bg-slate-700 text-white w-[13rem] rounded-md";
          let forecastDateEl = document.createElement("p");
          forecastDateEl.className = "forecastDate";
          let forecastIconEl = document.createElement("img");
          forecastIconEl.className = "forecastIcon";

          let forecastTempEl = document.createElement("p");
          forecastTempEl.className = "forecastTemp";

          let forecastWindEl = document.createElement("p");
          forecastWindEl.className = "forecastWind";

          let forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.className = "forecastHumidity";

          var dataDump = data.list[i];

          var dateDump = new Date(dataDump.dt * 1000).toLocaleDateString(
            "en-US"
          );
          var iconCodeDump = dataDump.weather[0].icon;
          var iconURLDump =
            "http://openweathermap.org/img/w/" + iconCodeDump + ".png";

          forecastDateEl.textContent = dateDump;
          forecastIconEl.setAttribute("src", iconURLDump);
          forecastTempEl.textContent =
            "Temp:  " + Math.round(dataDump.main.temp - 273.15) + "°C";
          forecastWindEl.textContent = "Wind: " + dataDump.wind.speed + " MPH";
          forecastHumidityEl.textContent =
            "Humidity: " + dataDump.main.humidity + " %";

          forecastTileEl.appendChild(forecastDateEl);
          forecastTileEl.appendChild(forecastIconEl);
          forecastTileEl.appendChild(forecastTempEl);
          forecastTileEl.appendChild(forecastWindEl);
          forecastTileEl.appendChild(forecastHumidityEl);
          forecastDataEl.appendChild(forecastTileEl);
        }
      });
  });
}
//function getting latitude and longitude from API and waits till all data is processed and then displays it
async function getLatLonValue(searchedValue) {
  let latLongApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedValue}&appid=${apiKey}`;
  var returningString = "";
  await fetch(latLongApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      returningString = `lat=${lat}&lon=${lon}`;
    });
  return returningString;
}
// this function is adding data to search history element
var searchedHistory = [];
function setupSearchedHistory(searchedValue) {
  forecastDataEl.innerHTML = "";
  searchedHistory = storedHistoryList;
  searchedHistory.push(searchedValue);
  localStorage.setItem("history", searchedHistory);
  // creating search tile again so whenever user clicks on the search history tile
  //it should create new search tile instead of waiting for local storage to render

  let searchTileEl = document.createElement("div");
  searchTileEl.className =
    "searchTile mt-3 p-2 w-[15rem] border rounded-md bg-gray-400 cursor-pointer text-gray-800 text-center text-lg font-bold  hover:bg-gray-500 hover:text-white";
  searchTileEl.textContent = searchedValue;
  searchHistoryEl.appendChild(searchTileEl);
}
// function gets data value on click event from search history tile
function checkedHistory(event) {
  let historyButtonClicked = event.target.textContent;
  searchInput.value = historyButtonClicked;
  runAPI();
}

searchHistoryEl.addEventListener("click", checkedHistory);
searchButton.addEventListener("click", runAPI);
