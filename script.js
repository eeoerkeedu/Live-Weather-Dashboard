var headerDate = $(".header-date");
var cardDate = $(".card-date");
var cityInput = "tokyo";
var cityLat = 0;
var cityLon = 0;
var cityName = document.getElementById("cityname");
var todayIcon = $("#todayIcon");
var icons = $(".icon");
var todayTemp = document.getElementById("todayTemp");
var todayWind = document.getElementById("todayWind");
var todayHumid = document.getElementById("todayHumid");
var todayUV = document.getElementById("todayUV");
var currentWeather = $("#currentWeather");
var todayDate = moment();
var iconData = 0;

var fiveDay = [1, 2, 3, 4, 5];

function citySearchApply() {
  icons.removeClass("d-none");

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
          todayTemp.textContent = "Tempurature: " + tempToday + "  degrees F";
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
        });
    });
}

function generateDates() {
  $(headerDate).text(todayDate.format("MMMM Do, YYYY"));

  fiveDay.forEach(function (setDates) {
    var dayId = setDates;
    var futureDate = moment().add(setDates, "days").format("MM-DD-YY");

    document.getElementById("date" + setDates).textContent = futureDate;
  });
}

generateDates();

$("#citiessearch").on("click", citySearchApply);
