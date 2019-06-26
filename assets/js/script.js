$(() => {


    var flightTable, eventTable; // Holds our tables so we can destroy them if the users do another search
    var weatherCity; // Holds the city we get the weather for

    // Create our Datepickers
    $("#departInput").datepicker({
        format: "mm/dd/yyyy"
    });

    $("#returnInput").datepicker({
        format: "mm/dd/yyyy"
    });

    // Add validator methods for dates
    $.validator.addMethod("dateFormat", function (value, element) {
        var dtRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/);
        return this.optional(element) || dtRegex.test(value);
    }, "Date format must be mm/dd/yyyy");

    $.validator.addMethod("dateAfter", function (value, element) {
        if ($(".dateAfter-check").val() === "" || value === "")
            return true;

        var checkAgainst = moment($(".dateAfter-check").val(), "MM-DD-YYYY");
        var ourMoment = moment(value, "MM-DD-YYYY");

        return this.optional(element) || ourMoment.isAfter(checkAgainst);
    }, "The return date must be after the departure date");


    // Prepare the flight data for tha table and call create.
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
            quote.id = flight.Quotes[i].QuoteId;

            quotes.push(quote);
        }

        createFlightTable(quotes);
    }

    // Prepare the event data for the event table and call create.
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
            emptyObj.is_free = data.events[i].is_free ? "Yes" : "No";
            emptyObj.id = data.events[i].id;
            eventData.push(emptyObj);
        }

        createEventTable(eventData);
    }

    // Write the weather data in human readable format
    function weatherData(data) {
        $("#weatherCard").html("<div class='col-lg-1 col-md-2 d-none d-sm-block'></div>");
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

        // Write to our card
        for (var i = 0; i < forecastData.length; i++) {
            var colDiv = $("<div>");
            colDiv.addClass("text-center col-lg-2 col-md-4 col-12 mt-lg-0 mt-1 border");

            var dateDiv = $("<div>");
            dateDiv.text(forecastData[i].date.format("MM/DD/YYYY"));
            colDiv.append(dateDiv);

            var iconDiv = $("<img>", {
                src: "https://openweathermap.org/img/w/" + forecastData[i].icon + ".png",
                alt: forecastData.main,
            });

            colDiv.append(iconDiv);

            mainDiv = $("<div>");
            mainDiv.text(forecastData[i].main);
            colDiv.append(mainDiv);

            var farDiv = $("<div>");
            farDiv.text(forecastData[i].temp.toFixed(1) + "° F");
            colDiv.append(farDiv);

            var celDiv = $("<div>");
            celDiv.text(forecastData[i].temp1.toFixed(1) + "° C");
            colDiv.append(celDiv);

            var humDiv = $("<div>");
            colDiv.append(humDiv);

            $("#weatherCard").append(colDiv);

        }
    }

    // Send off our data to the APIs
    function sendData(org, dest, startMoment, endMoment) {
        var endFlight, endEvent;

        // The APIs accept different time formats, so format forthe right ones
        if (endMoment) {
            endFlight = endMoment.format("YYYY-MM-DD");
            endEvent = endMoment.format("YYYY-MM-DDThh:mm:ss");
        }

        // Get the city for the weather
        weatherCity = $("#destinationInput").val();

        // Do our API calls in succession, then write the data to the cards
        getRoute(org, dest, startMoment.format("YYYY-MM-DD"), function (flightData) {
            dateEvent($("#destinationInput").val(), startMoment.format("YYYY-MM-DDThh:mm:ss"), function (eventData) {
                getForecast($("#destinationInput").val(), function (weaData) {
                    weatherData(weaData);
                    $(".cardholder-overlay").fadeIn();
                    $(".cardholder").fadeIn(function () {
                        writeFlight(flightData);
                        theEventData(eventData);
                        $("#clearButton").removeClass("disabled");
                        $("#saveButton").removeClass("disabled");
                    });

                });
            }, endEvent);
        }, endFlight);

        $("#multipleCities").modal("hide");

        // Hide the carousel buttons
        $(".carousel-control-prev").fadeOut();
        $(".carousel-control-next").fadeOut();
        $(".carousel-caption").fadeOut(function () {
            $(this).removeClass("d-md-block");
        });
        $(".carousel-indicators").fadeOut();
    }

    // Creates our flight datatable.
    function createFlightTable(quotes) {
        flightTable = $("#flightTable").DataTable({
            data: quotes,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "200px",
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

    // Creates our event datatable.
    function createEventTable(eventData) {
        eventTable = $("#eventTable").DataTable({
            data: eventData,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "200px",
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
                        return start.format("MM/DD/YYYY, h:mm:ss a");
                    },
                    responsivePriority: 3
                },
                {
                    title: "End Date",
                    data: "end",
                    render: function (data) {
                        var end = moment(data);
                        return end.format("MM/DD/YYYY, h:mm:ss a");
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

    // Validate our search form
    $("#searchForm").validate({
        rules: {
            departure: {
                required: true,
                dateFormat: true
            },
            return: {
                dateFormat: true,
                dateAfter: true
            }
        },
        errorPlacement: function (error, element) { // Plaace errors in the proper locations.
            if (element.attr("name") === "origin")
                error.appendTo($("#errorOrigin"));
            else if (element.attr("name") === "destination")
                error.appendTo($("#errorDestination"));
            else if (element.attr("name") === "departure")
                error.appendTo($("#errorDepart"));
            else if (element.attr("name") === "return")
                error.appendTo($("#errorReturn"));
            else
                error.insertAfter(element);
        }
    });

    $("#submitButton").click(function (e) {
        e.preventDefault();

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
                        else if (dataOrigin.Places.length > 1 || dataDestination.Places.length > 1) { // More than one location found for either, ask user to specify
                            $("#originSelect").empty();
                            $("#destinationSelect").empty();
                            // Create options for both Selects
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
                        else if (dataOrigin.Places.length === 1 && dataDestination.Places.length === 1) { // One found for each, go on ahead
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
    });

    // Select location click event
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

    // Clear button click event
    $("#clearButton").click((e) => {
        if ($(e.target).hasClass("disabled")) // Button disable check
            return;

        // Clear the overlays
        $(".cardholder").fadeOut();
        $(".cardholder-overlay").fadeOut(function () {
            flightTable.destroy();
            eventTable.destroy();

            localStorage.clear();

            $("#flightTable").empty(); // Table objects are destroyed but leave the data in the tables, clear them
            $("#eventTable").empty();

            $("#clearButton").addClass("disabled"); // disable our buttons
            $("#saveButton").addClass("disabled");

            // Put the carousel buttons back
            $(".carousel-control-prev").fadeIn();
            $(".carousel-control-next").fadeIn();
            $(".carousel-caption").fadeIn(function () {
                $(this).addClass("d-md-block");
            });
            $(".carousel-indicators").fadeIn();
        });
    });

    // Save button click event
    $("#saveButton").click((e) => {
        if ($(e.target).hasClass("disabled"))
            return;

        localStorage.clear();

        // Save everything to localStorage
        var flights = flightTable.data().toArray();
        var events = eventTable.data().toArray();
        var selectedFlight = flightTable.rows({ selected: true }).data().toArray(); // get things selected in the datatables
        var selectedEvents = eventTable.rows({ selected: true }).data().toArray();

        localStorage.setItem("weatherCity", weatherCity);
        localStorage.setItem("flights", JSON.stringify(flights));
        localStorage.setItem("events", JSON.stringify(events));
        if (selectedFlight.length > 0)
            localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight[0]));
        if (selectedEvents.length > 0)
            localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));

    });

    var savedFlightData = JSON.parse(localStorage.getItem("flights"));
    var savedEventData = JSON.parse(localStorage.getItem("events"));
    weatherCity = localStorage.getItem("weatherCity");

    // localStorage data check, load if found
    if (Array.isArray(savedEventData) && Array.isArray(savedFlightData) && weatherCity) {
        getForecast(weatherCity, function (weaData) {
            weatherData(weaData);

            $(".carousel-control-prev").fadeOut();
            $(".carousel-control-next").fadeOut();
            $(".carousel-caption").fadeOut(function () {
                $(this).removeClass("d-md-block");
            });
            $(".carousel-indicators").fadeOut();

            $(".cardholder-overlay").fadeIn();
            $(".cardholder").fadeIn(function () {
                createFlightTable(savedFlightData);
                createEventTable(savedEventData);
                $("#clearButton").removeClass("disabled");
                $("#saveButton").removeClass("disabled");

                // Select saved selected rows if found.
                if (localStorage.hasOwnProperty("selectedFlight")) {
                    var selFlight = JSON.parse(localStorage.getItem("selectedFlight"));
                    flightTable.row(function (idx, data, node) {
                        return data.id === selFlight.id;
                    }).select();
                }
                if (localStorage.hasOwnProperty("selectedEvents")) {
                    var selectedEvents = JSON.parse(localStorage.getItem("selectedEvents"));

                    eventTable.rows(function (idx, data, node) {
                        var found = selectedEvents.find(ev => ev.id === data.id);

                        return found ? true : false;
                    }).select();

                }

            });
        });
    }

});