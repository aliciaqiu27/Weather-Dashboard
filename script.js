 // Here, the history of the User cities is being grabbed from local storage. If there is no data in the local storage, the array would be empty.
        let userCityArray = JSON.parse(localStorage.getItem("cities")) || []
        $("#searchButton").on("click", function(event) {

        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();

            var searchBtn = $("#searchButton");
            var cityName = $("#locationInput").val().trim();
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=1b5e9096e8f25e04ccd2e1d65aa7ae08";
            
            $("#History-goes-here").empty();
            userCityArray.push(cityName);
            localStorage.setItem("cities",JSON.stringify(userCityArray))

            for (let i = 0; i < userCityArray.length; i++) {
                let citiesDiv = $("<p>");
                citiesDiv.addClass("historyBlock")
                citiesDiv.prepend(userCityArray[i])
                $("#History-goes-here").prepend(citiesDiv);
            }

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            //When the User inputs the city name, the latitude and longitude values will be called.
            var lat = response.coord.lat
            var lon = response.coord.lon

            var ForecastIndexQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial" + "&appid=1b5e9096e8f25e04ccd2e1d65aa7ae08";

        $.ajax({
            url: ForecastIndexQueryURL,
            method: "GET"
        }).then(function(res) {

        $("#currentResults").empty();
        
            //grabs the weather current weather icons from the daily array
            let currentRes = res.current;
            let currentDiv = $("<div>");
            let currentIconArray = currentRes.weather[0].icon;
            let currentWeatherIcon = "http://openweathermap.org/img/w/" + currentIconArray + ".png";

            //grabs the current date and converts date from dt integer to date format        
            let date = new Date(currentRes.dt*1000);
            let year = date.getFullYear();
            console.log(year);
            let day = date.getDate();
            let monthsArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            let month = monthsArray[date.getMonth()];
            let DateDisplayed = month + '-' + day + '-' + year;

            //appends the API values to the div
            let userCity = $("<header>").html("<h1>" + cityName + " " + DateDisplayed + "</h1>");
            userCity.css("display", "inline-block");
            let currentIcon = $("<img>").attr('src', currentWeatherIcon);
            currentIcon.css("display", "inline-block");
            let currentTemp = $("<li>").text("Temperature: " + currentRes.temp + "°F");
            let currentHumidity = $("<li>").text("Humidity: " + currentRes.humidity);
            let currentWindSpeed = $("<li>").text("Wind Speed: " + currentRes.wind_speed);
            let currentUVId = $("<container>").text("UV Index: " + currentRes.uvi);

        if (currentRes.uvi>5) {
            currentUVId.addClass("red");
        }
        else {
            currentUVId.addClass("green");
        }

            //appends the content from the div to the html
            currentDiv.append(userCity, currentIcon, currentTemp, currentHumidity, currentWindSpeed, currentUVId);
            $("#currentResults").append(currentDiv);

            
            console.log(res);
            let results = res.daily;
            $("#five-day-forecast-goes-here").empty();            

            // Looping through each result item
            for (let i = 0; i < 5; i++) {

                //grabs the current date and converts date from dt integer to date format        
                let date = new Date(results[i].dt*1000);
                let year = date.getFullYear();
                console.log(year);
                let day = date.getDate();
                let monthsArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                let month = monthsArray[date.getMonth()];
                let DateDisplayed = month + '-' + day + '-' + year;


                $("#header").html("<h1>" + "5-Day Forecast" + "</h1>");

                // Creating and storing a div tag
                let forecastDiv = $("<div>");
                forecastDiv.addClass("col-md forecast-div")

                //grabs the weather daily weather icons from the daily array
                let iconArray = results[i].weather[0].icon;
                let weatherIcon = "http://openweathermap.org/img/w/" + iconArray + ".png";
                let iconDisplayed = $("<img>").attr('src', weatherIcon);
                iconDisplayed.css("display", "inline-block");

                //appends the API values to the div tag
                let dates = $("<p>").html("<h2>" + DateDisplayed + "</h2>");
                dates.css("display", "inline-block");
                // Creating a paragraph tag with the result item's rating
                let dailyTemp = $("<p>").text("Temperature: " + results[i].temp.day + "°F");
                let dailyHumidity = $("<p>").text("Humidity: " + results[i].humidity);
                // Appending the paragraph and image tag to the animalDiv
                forecastDiv.append(dates, iconDisplayed, dailyTemp, dailyHumidity);

                //appends the content from the div tag to the html
                $("#five-day-forecast-goes-here").append(forecastDiv);
            }

        })
        .catch(err=>console.log(err))
        

    });
});
