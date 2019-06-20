# BC-Project-One

This is the Magic Carpet. The place where you can view various informatiin about flights, events and weather for your destinations.

# User interaction

1. User enters their origin, destination, departure date, and optionally their return date into the fields at the botton and clicks submit.

2. Application will grab cities for the origin and do one of the following
    * If the origin or destination is not found, it will display a modal saying so.
    * If one of each for the origin and destination are found, it will got straight on to display data.
    * If multiple cities are found for either, it will show a modal asking the user to specify.

3. Application will display Flights, Events in tables, and weather in a Five day forecast.

4. User can save the data, highlight rows in the tables and save, or clear the data to start over.

# Validation

* Required
    - Origin, Destination, Departure
* Date Format mm/dd/yyyy
    - Departure, Return
* Date After Departure
    - Return