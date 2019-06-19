// Function to call our events API
function dateEvent(city, startDate, callback, endDate) {

    var url = "https://www.eventbriteapi.com/v3/events/search/?q=" + city + "&token=TTEETSQICF2P3XU5IF2R&sort_by=date&start_date.range_start=" + startDate;

    // Optional parameter
    if (endDate)
        url += "&start_date.range_end=" + endDate;

    var cityEvent =
        $.get({
            url: url
        }).done(callback).fail((err) => {
            console.log("FAILED: " + err);
            $("#searchStatus").text("An Error Occured. Please try again later.");
        });
};
