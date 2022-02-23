var headerDate = $(".header-date");
var cardDate = $(".card-date");
var cityName = document.getElementById("cityname");
var todayIcon = $("#todayIcon");
var icons = $(".icon");
var todayTemp = document.getElementById("todayTemp");
var todayWind = document.getElementById("todayWind");
var todayHumid = document.getElementById("todayHumid");
var todayUV = document.getElementById("todayUV");
var currentWeather = $("#currentWeather");
var searchFieldInput = $("#cityinputfield");

var todayDate = moment();
var iconData = 0;
var cityInput = "";
var cityLat = 0;
var cityLon = 0;
var fiveDay = [1, 2, 3, 4, 5];
var searchHistory = [];

function handleCityInput() {
  cityInput = $(searchFieldInput).val();

  searchHistory.push(cityInput);
  citySearchApply();
  handleHistoryStore();
  handleHistoryGen();
  searchFieldInput.val("");
}

function citySearchApply() {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityInput +
      ",&limit=1&appid=8ea0860b7dd06d7fe2a61e0180fed681",
    {
      cache: "reload",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var nameData = data[0].name;
      cityLat = data[0].lat;
      cityLon = data[0].lon;
      cityName.textContent =
        nameData + " Today: " + todayDate.format("MM-DD-YY");

      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&units=imperial&appid=8ea0860b7dd06d7fe2a61e0180fed681",
        {
          cache: "reload",
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var iconData = data["current"].weather[0].icon;
          var iconGen = "http://openweathermap.org/img/w/" + iconData + ".png";
          var tempToday = data["current"].temp;
          var windToday = data["current"].wind_speed;
          var humidToday = data["current"].humidity;
          var uvToday = data["current"].uvi;

          todayIcon.attr("src", iconGen);
          todayTemp.textContent = "Tempurature: " + tempToday + "° F";
          todayWind.textContent = "Wind Speed: " + windToday + "  mph";
          todayHumid.textContent = "Humidity: " + humidToday + "  %";
          todayUV.textContent = "UV Index: " + uvToday;

          if (uvToday > 6) {
            todayUV.style = "background: red";
          } else if (uvToday > 3) {
            todayUV.style = "background: yellow";
          } else {
            todayUV.style = "background: green";
          }

          fiveDay.forEach(function (forecast) {
            var daySet = forecast - 1;
            var iconData = data.daily[daySet].weather[0].icon;
            var iconGen =
              "http://openweathermap.org/img/w/" + iconData + ".png";
            var forecastIcons = $("#" + forecast + "Icon");
            var forecastTemps = $("#" + forecast + "Temp");
            var forecastWinds = $("#" + forecast + "Wind");
            var forecastHumid = $("#" + forecast + "Humid");
            var temps = data.daily[daySet].temp["day"];
            var winds = data.daily[daySet].wind_speed;
            var humidPerc = data.daily[daySet].humidity;

            forecastIcons.attr("src", iconGen);
            forecastTemps.text("Temp: " + temps + "° F");
            forecastWinds.text("Winds: " + winds + "mph");
            forecastHumid.text("Humidity: " + humidPerc + "%");
          });
        });
    });
}

function generateDates() {
  $(headerDate).text(todayDate.format("MMMM Do, YYYY"));

  fiveDay.forEach(function (setDates) {
    var futureDate = moment().add(setDates, "days").format("MM-DD-YY");

    document.getElementById("date" + setDates).textContent = futureDate;
  });
}

function handleHistoryGen() {
  $("#cityHistory").empty();
  if (searchHistory.length > 5) {
    searchHistory.shift();
  }
  searchHistory.forEach(function (saveHistory) {
    var historyList = $("#cityHistory");
    var historyLine = $("<li>");
    var historyButton = $("<button>");
    var historyInput = saveHistory;

    historyButton.text(historyInput);
    historyButton.addClass("historybtn");
    historyLine.append(historyButton);
    historyList.append(historyLine);
  });
}

function useHistory(event) {
  element = event.target;
  var btnText = element.textContent;
  cityInput = btnText;
  citySearchApply();
}

function handleHistoryStore() {
  localStorage.setItem("cityHistory", JSON.stringify(searchHistory));
}

function handleHistoryDisplay() {
  var savedCities = JSON.parse(localStorage.getItem("cityHistory"));

  if (savedCities !== null) {
    searchHistory = savedCities;
  }
}

function init() {
  cityInput = "Denver";
  generateDates();
  handleHistoryDisplay();
  citySearchApply();
  handleHistoryGen();
}

init();

$("#citiessearch").on("click", handleCityInput);

$(".historybtn").on("click", useHistory);
