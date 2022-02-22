var headerDate = $(".header-date")


var todayDate = moment()



$(headerDate).text(todayDate.format("MMMM Do, YYYY"))