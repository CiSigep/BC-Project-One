// Fligth JS //
$(() => {


    var flightTable, eventTable;

    $("#departInput").datepicker({
        format: "mm/dd/yyyy"
    });

    $("#returnInput").datepicker({
        format: "mm/dd/yyyy"
    });

    $.validator.addMethod("dateFormat", function (value, element) {
        var dtRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/);
        return this.optional(element) || dtRegex.test(value);
    }, "Date format must be mm/dd/yyyy");


    function writeFlight(flight) {
        var quotes = [];
        for (var i = 0; i < flight.Quotes.length; i++) {
            var quote = {};
            quote.minPrice = flight.Quotes[i].MinPrice;
            quote.direct = flight.Quotes[i].Direct ? "Yes" : "No";
            quote.carriers = flight.Carriers.filter((carrier) => flight.Quotes[i].OutboundLeg.CarrierIds.indexOf(carrier.CarrierId) > -1);
            quote.depart = flight.Quotes[i].OutboundLeg.DepartureDate;
            quote.start = flight.Places.find((place) => place.PlaceId === flight.Quotes[i].OutboundLeg.OriginId);
            quote.end = flight.Places.find((place) => place.PlaceId === flight.Quotes[i].OutboundLeg.DestinationId);

            quotes.push(quote);
        }

        if (flightTable)
            flightTable.destroy();

        flightTable = $("#flightTable").DataTable({
            data: quotes,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "100px",
            select: "single",
            columns: [
                {
                    title: "Minimum Price",
                    data: "minPrice",
                    render: function (data) {
                        return "$" + data;
                    },
                    responsivePriority: 1
                },
                {
                    title: "Carriers",
                    data: "carriers",
                    render: function (data) {
                        var carStr = "";
                        for (var i = 0; i < data.length; i++) {
                            carStr += data[i].Name;

                            if (i < data.length - 1)
                                carStr += ", ";
                        }

                        return carStr;
                    },
                    responsivePriority: 5
                },
                {
                    title: "Direct?",
                    data: "direct",
                    responsivePriority: 6
                },
                {
                    title: "Departure Date",
                    data: "depart",
                    render: function (data) {
                        var date = moment(data);
                        return date.format("MM/DD/YYYY");
                    },
                    responsivePriority: 5
                },
                {
                    title: "Origin",
                    data: "start",
                    render: function (data) {
                        return data.Name;
                    },
                    responsivePriority: 3
                },
                {
                    title: "Destination",
                    data: "end",
                    render: function (data) {
                        return data.Name;
                    },
                    responsivePriority: 2
                },

            ]
        });

    }
    // Event JS//
    // Make a function that passes data from the eventData and puts it in this function
    function theEventData(data) {
        var eventData = [];
        for (var i = 0; i < data.events.length; i++) {
            var emptyObj = {};
            emptyObj.name = data.events[i].name.text;
            if (!data.events[i].description.text) {
                emptyObj.description = "No Description";
            }
            else {
                if (data.events[i].description.text.length > 50)
                    emptyObj.description = data.events[i].description.text.substr(0, 50) + "...";
                else
                    emptyObj.description = data.events[i].description.text;

            }
            emptyObj.start = data.events[i].start.local;
            emptyObj.end = data.events[i].end.local;
            emptyObj.url = data.events[i].url;
            // Ternary Expression
            emptyObj.is_free = data.events[i].is_free ? "Yes" : "No";
            eventData.push(emptyObj);
        }

        if (eventTable)
            eventTable.destroy();

        eventTable = $("#eventTable").DataTable({
            data: eventData,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "100px",
            data: eventData,
            select: "multi",
            columns: [
                {
                    title: "Name",
                    data: "name",
                    responsivePriority: 1
                },
                {
                    title: "Description",
                    data: "description",
                    responsivePriority: 2
                },
                {
                    title: "Start Date",
                    data: "start",
                    render: function (data) {
                        var start = moment(data);
                        return start.format("MMMM Do YYYY, h:mm:ss a");
                    },
                    responsivePriority: 3
                },
                {
                    title: "End Date",
                    data: "end",
                    render: function (data) {
                        var end = moment(data);
                        return end.format("MMMM Do YYYY, h:mm:ss a");
                    },
                    responsivePriority: 4
                },
                {
                    title: "URL",
                    data: "url",
                    responsivePriority: 5
                },
                {
                    title: "Free?",
                    data: "is_free",
                    responsivePriority: 6
                }
            ]
        });
    }
    // Weather JS //
    function weatherData(data) {
        var forecastData = [];
        for (var i = 0; i < data.length; i++) {
            var forecasts = {};
            forecasts.date = moment(data[i].dt_txt);
            forecasts.icon = data[i].weather[0].icon;
            forecasts.temp = (data[i].main.temp - 273.15) * 1.80 + 32;
            forecasts.temp1 = data[i].main.temp - 273.15;
            forecasts.main = data[i].weather[0].main;
            forecasts.humidity = (data[i].main.humidity + "%");
            forecastData.push(forecasts);
        }


        for (var i = 0; i < forecastData.length; i++) {
            var colDiv = $("<div>");
            colDiv.addClass("text-center col-lg-2 col-md-4 col-12 mt-lg-0 mt-1 border");



            var dateDiv = $("<div>");
            dateDiv.text(forecastData[i].date.format("MM/DD/YYYY"));
            colDiv.append(dateDiv);


            var iconDiv = $("<img>",
                {
                    src: "https://openweathermap.org/img/w/" + forecastData[i].icon + ".png",
                    alt: forecastData.main,
                });

            colDiv.append(iconDiv);

            mainDiv = $("<div>");
            mainDiv.text(forecastData[i].main);
            colDiv.append(mainDiv);

            var farDiv = $("<div>");
            farDiv.text(forecastData[i].temp.toPrecision(3) + "° F");
            colDiv.append(farDiv);

            var celDiv = $("<div>");
            celDiv.text(forecastData[i].temp1.toPrecision(3) + "° C");
            colDiv.append(celDiv);

            var humDiv = $("<div>");
            colDiv.append(humDiv);

            $("#weatherCard").append(colDiv);

        }
    }

    function sendData(org, dest, startMoment, endMoment) {
        var endFlight, endEvent;

        if (endMoment) {
            endFlight = endMoment.format("YYYY-MM-DD");
            endEvent = endMoment.format("YYYY-MM-DDThh:mm:ss");
        }

        getRoute(org, dest, startMoment.format("YYYY-MM-DD"), function(data) {
            writeFlight(data);
            dateEvent($("#destinationInput").val(), startMoment.format("YYYY-MM-DDThh:mm:ss"), function(data) {
                theEventData(data);
                getForecast($("#destinationInput").val(), function(data) {
                    weatherData(data);
                    $(".cardholder").fadeIn();

                    flightTable.responsive.recalc();
                    eventTable.responsive.recalc();
                });
            }, endEvent);
        }, endFlight);

        $("#multipleCities").modal("hide");

        $(".carousel-control-prev").fadeOut();
        $(".carousel-control-next").fadeOut();
        $(".carousel-caption").fadeOut(function () {
            $(this).removeClass("d-md-block");
        });
        $(".carousel-indicators").fadeOut();
    }

    $("#searchForm").validate({
        rules: {
            departure: {
                required: true,
                dateFormat: true
            },
            return: {
                dateFormat: true
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") === "origin")
                error.appendTo($("#errorOrigin"));
            else if (element.attr("name") === "destination")
                error.appendTo($("#errorDestination"));
            else if (element.attr("name") === "departure")
                error.appendTo($("#errorDepart"));
            else if (element.att("name") === "return")
                error.appendTo($("#errorReturn"));
            else
                error.insertAfter(element);
        }
    });

    $("#submitButton").click((e) => {

        if ($("#searchForm").valid()) {
            $("#searchStatus").html("<img src='assets/images/ajax-loader.gif' alt='Loading' style='max-height:30px'>");
            getCity($("#destinationInput").val(), function (dataDestination) {
                if (dataDestination.Places.length === 0) {
                    $("#searchStatus").empty();
                    $("#notFoundContent").text("Your destination was not found.");
                    $("#notFoundModal").modal();
                }
                else {
                    getCity($("#originInput").val(), function (dataOrigin) {
                        $("#searchStatus").empty();
                        if (dataOrigin.Places.length === 0) {
                            $("#notFoundContent").text("Your origin was not found.");
                            $("#notFoundModal").modal();
                        }
                        else if (dataOrigin.Places.length > 1 || dataDestination.Places.length > 1) {
                            $("#originSelect").empty();
                            $("#destinationSelect").empty();
                            for (var i = 0; i < dataOrigin.Places.length; i++) {
                                var opt = $("<option>");

                                opt.text(dataOrigin.Places[i].PlaceName + " " + dataOrigin.Places[i].PlaceId);
                                opt.attr("value", dataOrigin.Places[i].PlaceId);

                                $("#originSelect").append(opt);
                            }
                            for (var i = 0; i < dataDestination.Places.length; i++) {
                                var opt = $("<option>");

                                opt.text(dataDestination.Places[i].PlaceName + " " + dataDestination.Places[i].PlaceId);
                                opt.attr("value", dataDestination.Places[i].PlaceId);

                                $("#destinationSelect").append(opt);
                            }
                            $("#multipleCities").modal();
                        }
                        else if (dataOrigin.Places.length === 1 && dataDestination.Places.length === 1) {
                            var org = dataOrigin.Places[0].PlaceId;
                            var dest = dataDestination.Places[0].PlaceId;
                            var depart = moment($("#departInput").val(), "MM-DD-YYYY");
                            var ret;

                            if ($("#returnInput").val().length > 0) {
                                ret = moment($("#returnInput").val(), "MM-DD-YYYY");
                            }

                            sendData(org, dest, depart, ret);
                        }

                    });
                }
            });
        }

        return false;
    });

    $("#selectBtn").click(() => {
        var org = $("#originSelect").val();
        var dest = $("#destinationSelect").val();
        var depart = moment($("#departInput").val(), "MM-DD-YYYY");
        var ret;

        if ($("#returnInput").val().length > 0) {
            ret = moment($("#returnInput").val(), "MM-DD-YYYY");
        }

        sendData(org, dest, depart, ret);
    });


});