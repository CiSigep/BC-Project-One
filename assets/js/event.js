
function dateEvent(city, startDate, callback, endDate) {

    var url = "https://www.eventbriteapi.com/v3/events/search/?q=" + city + "&token=TTEETSQICF2P3XU5IF2R&sort_by=date&start_date.range_start=" + startDate;
    
    if(endDate)
        url += "&start_date.range_end=" + endDate;

    var cityEvent =
        $.get({
            url: url
        }).done(callback)
            .fail((err) => {
                console.log("FAILED: " + err);
                $("#searchStatus").text("An Error Occured. Please try again later.");
            });
};

// Make a variable that will hold the date inputs
// Add the variable that holds the start to finish dates in the "date&start_date.range_start=DATE" + variable + "start_date.range_end=DATE"
// That way when the user enters the date it will automatically search for those dates