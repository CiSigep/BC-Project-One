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

    $("form").validate({
        errorPlacement: function(error, element){
            if(element.attr("name") === "origin")
                error.appendTo($("#errorOrigin"));
            else if(element.attr("name") === "destination")
                error.appendTo($("#errorDestination"));
            else if(element.attr("name") === "departure")
                error.appendTo($("#errorDepart"));
            else
                error.insertAfter(element);
        }
    });

    $("#submitButton").click((e) => {
        
        if($("form").valid()){
            console.log("Valid!");
            console.log($("#originInput").val());
            console.log($("#destinationInput").val());
            console.log($("#departInput").val());
            console.log($("#returnInput").val());
        }
        else{
            console.log("NOT VALID!");
        }

        return false;
    });
});

