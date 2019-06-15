
function dateEvent(city, startDate, endDate, callback){

    var cityEvent=
    $.get({
        url: "https://www.eventbriteapi.com/v3/events/search/?q=" + city + "&token=TTEETSQICF2P3XU5IF2R&sort_by=date&start_date.range_start=" + startDate + "&start_date.range_end=" + endDate



    }).done(callback)
    .fail((err) => {
        console.log("FAILED: " + err);
    });
};

// Make a variable that will hold the date inputs
// Add the variable that holds the start to finish dates in the "date&start_date.range_start=DATE" + variable + "start_date.range_end=DATE"
// That way when the user enters the date it will automatically search for those dates