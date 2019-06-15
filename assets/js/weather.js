function getForecast(city, callback) {

    var APIKey = "3ac41c12ffcc7dc523f176cc6f0ff210";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    $.get({
        url: queryURL
    }).done(function (data) {
        console.log(data);

        var offset = data.timezone;

        $.get({
            url: queryURL2
        }).done(function (data) {
            // Filter for noon UTC.
            var filteredForTimes = data.list.filter(dataPoint => dataPoint.dt_txt.indexOf("12:00:00") > 0);

            var timesToFind = [];

            // Push Noon in local time for city
            filteredForTimes.forEach(element => {
                timesToFind.push(element.dt - offset);
            });

            var timeToFindIndex = 0;

            // Filter data for nearest hour to noon.
            filteredForData = data.list.filter(dataPoint => {
                if (timeToFindIndex < timesToFind.length && Math.abs(dataPoint.dt - timesToFind[timeToFindIndex]) <= 3600) {
                    timeToFindIndex++;
                    return true;
                }

                return false;
            });

            callback(filteredForData);
        }).fail(function (err) { console.log(err) });
    });

}