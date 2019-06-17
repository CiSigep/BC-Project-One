// Fligth JS //
$(() => {

    $("#departInput").datepicker({
        format: "mm/dd/yyyy"
    });

    $("#returnInput").datepicker({
        format: "mm/dd/yyyy"
    });


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

        $(".cardholder").fadeIn();

        $("#flightTable").DataTable({
            data: quotes,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "100px",
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

        $(".cardholder").fadeIn();

        $("#eventTable").DataTable({
            data: eventData,
            paging: false,
            info: false,
            responsive: true,
            scrollY: "100px",
            data: eventData,
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
        console.log(eventData);
    }

});


