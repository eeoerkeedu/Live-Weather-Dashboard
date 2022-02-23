// establishes variables on on page elements
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

// establishes variables of objects and arrays to be used through the page
var todayDate = moment();
var iconData = 0;
var cityInput = "";
var cityLat = 0;
var cityLon = 0;
var fiveDay = [1, 2, 3, 4, 5];
var searchHistory = [];

// applies user input to the funtions of the page, adds user search input to history list clears field after funtions complete
function handleCityInput() {
  cityInput = $(searchFieldInput).val();

  searchHistory.unshift(cityInput);
  citySearchApply();
  handleHistoryStore();
  handleHistoryGen();
  searchFieldInput.val("");
}

// main function of the page, fetches the geolocation data compared to the user's input,
// then uses the location data to fetch the correct weather for the user input,
// finally pushes the relevant data and links to the current weather list and the
// 5 day forecast cards.
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

//sets the date fields on the header, current weather field, and the 5 day forecast cards
function generateDates() {
  $(headerDate).text(todayDate.format("MMMM Do, YYYY"));

  fiveDay.forEach(function (setDates) {
    var futureDate = moment().add(setDates, "days").format("MM-DD-YY");

    document.getElementById("date" + setDates).textContent = futureDate;
  });
}

// creates il's with buttons for each user input and generates the list after each search
// input, also removes history entries if the array is over 5 items, also establishes the
// button functions to que the page to respond if a previous search's button is pressed.
function handleHistoryGen() {
  $("#cityHistory").empty();
  if (searchHistory.length > 5) {
    searchHistory.pop();
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
  $(".historybtn").on("click", useHistory);
}

//applys the history button's text as the city input for the weather search
function useHistory(event) {
  event.preventDefault();
  element = event.target;
  var btnText = element.textContent;
  cityInput = btnText;
  citySearchApply();
}

// handles the local storage of the array of user input history
function handleHistoryStore() {
  localStorage.setItem("cityHistory", JSON.stringify(searchHistory));
}

// handles the reproduction of the history list on page load, presenting a default if there is no history
function handleHistoryDisplay() {
  var savedCities = JSON.parse(localStorage.getItem("cityHistory"));

  if (savedCities !== null) {
    searchHistory = savedCities;
    cityInput = searchHistory[0];
  } else {
    cityInput = "Denver";
  }
}

//runs a set of funtions on page load to give the user an easier time navigating the page.
function init() {
  generateDates();
  handleHistoryDisplay();

  citySearchApply();
  handleHistoryGen();
}

// runs the ini function on page load
init();

// sets the serach cities button to activate the sever functions within handle City Input
$("#citiessearch").on("click", handleCityInput);
