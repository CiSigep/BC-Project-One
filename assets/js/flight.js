function getCity(cityName, callback){
    $.get({
        url : "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/",
        data: { query: cityName },
        headers: {
            "X-RapidAPI-Host" : "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "X-RapidAPI-Key" : "8210dd9043mshd84d3c53b89a62ap1c4662jsna0073fd4c889" 
        }
    }).done(callback).fail((err) => {
        console.log("FAILED: " + err);
    });
}

function getRoute(start, end, outboundDate, callback, inboundDate) {

    var endpoint = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + start + "/" + end + "/" + outboundDate;

    if(inboundDate)
        endpoint += "inboundpartialdate=" + inboundDate;

    $.get({
        url : endpoint,
        headers: {
            "X-RapidAPI-Host" : "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "X-RapidAPI-Key" : "8210dd9043mshd84d3c53b89a62ap1c4662jsna0073fd4c889" 
        }
    }).done(callback).fail((err) => {
        console.log("FAILED: " + err);
    });
}