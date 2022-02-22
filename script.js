var headerDate = $(".header-date");
var cardDate = $(".card-date");

var todayDate = moment();
// var weekDay = moment().weekDay();

function generateDates() {
  $(headerDate).text(todayDate.format("MMMM Do, YYYY"));
  // var idToDay = cardDate.attr("id").val();
  // var forcastDate = weekDay + idToDay;
  // var cardDay = moment().weekDay(forcastDate);
}

generateDates();
