// Get City function, calls our API to get the cities we want to look at
function getCity(cityName, callback) {
    $.get({
        url: "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/",
        data: { query: cityName },
        headers: {
            "X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "8210dd9043mshd84d3c53b89a62ap1c4662jsna0073fd4c889"
        }
    }).done(callback).fail((err) => {
        console.log("FAILED: " + err);
        $("#searchStatus").text("An Error Occured. Please try again later.");
    });
}

// Calls the API to get routes for the selected origin and destination for the dates requested.
function getRoute(start, end, outboundDate, callback, inboundDate) {

    var endpoint = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + start + "/" + end + "/" + outboundDate;

    // Optional parameter
    if (inboundDate)
        endpoint += "?inboundpartialdate=" + inboundDate;

    $.get({
        url: endpoint,
        headers: {
            "X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "8210dd9043mshd84d3c53b89a62ap1c4662jsna0073fd4c889"
        }
    }).done(callback).fail((err) => {
        console.log("FAILED: " + err);
        $("#searchStatus").text("An Error Occured. Please try again later.");
    });
}