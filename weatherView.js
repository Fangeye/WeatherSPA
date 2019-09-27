function handleErrors(response) {
    if(!response.ok) {
        var errMsg = response.status + " " + response.statusText;
        throw Error(errMsg)
    }
    return response;
}

function reqDynCity() {
    var i = document.getElementById("menu").selectedIndex;
    var city = document.getElementById("menu")[i].innerHTML;
    var url = "http://api.apixu.com/v1/current.json?key=2d7f799bf7b34fd7b48200506182111&q=";
    url += city;
    
    fetch(url)
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonObj) {
            showCity(jsonObj, "dynCity");
        })
        .catch(function(error) {
            showErr(error);
        });
}

function reqStatCity() {
    var url = "http://api.apixu.com/v1/current.json?key=2d7f799bf7b34fd7b48200506182111&q=San Francisco";
    
    fetch(url)
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonObj) {
            showCity(jsonObj, "statCity");
        })
        .catch(function(error) {
            showErr(error);
        });
}

function showCity(jsonObj, row) {
    document.getElementById("err").innerHTML = "";

    var city = jsonObj.location.name;
    var forecast = "<input type='submit' value='Forecast' onclick='forecast(" + row + ")'/>";
    var localTime = jsonObj.location.localtime;
    var temp = jsonObj.current.temp_c + " C";
    var feels = jsonObj.current.feelslike_c + " C";
    var wind = jsonObj.current.wind_kph + " km/h";
    var vis = jsonObj.current.vis_km + " km";
    
    var table = document.getElementById("weatherTable");
    var index = document.getElementById(row).rowIndex

    table.deleteRow(index);

    var newRow = table.insertRow(index);
    newRow.id = row;
    var cell0 = newRow.insertCell(0);
    var cell1 = newRow.insertCell(1);
    var cell2 = newRow.insertCell(2);
    var cell3 = newRow.insertCell(3);
    var cell4 = newRow.insertCell(4);
    var cell5 = newRow.insertCell(5);
    var cell6 = newRow.insertCell(6);

    cell0.innerHTML = city;
    cell1.innerHTML = forecast;
    cell2.innerHTML = localTime;
    cell3.innerHTML = temp;
    cell4.innerHTML = feels;
    cell5.innerHTML = wind;
    cell6.innerHTML = vis;
    
    document.getElementById("forcast").innerHTML = "";
    
    if(jsonObj.current.temp_c < 20.0) {
        showCond(jsonObj, row);
    } else {
        delCond(row);
    }
    showAvgHot();
}

function showCond(jsonObj, row) {
    var cond = "Condition:";
    var condText = jsonObj.current.condition.text;

    var table = document.getElementById("weatherTable");
    var index = document.getElementById(row).rowIndex + 1;
    var newId = row + "Cond";
    
    if(document.getElementById(newId) != null) {
        table.deleteRow(index);
    }

    var newRow = table.insertRow(index);
    newRow.id = row + "Cond";
    var cell0 = newRow.insertCell(0);
    var cell1 = newRow.insertCell(1);
    cell1.colspan = 6;

    cell0.innerHTML = cond;
    cell1.innerHTML = condText;
}

function delCond(row) {
    var table = document.getElementById("weatherTable");
    var index = document.getElementById(row).rowIndex + 1;
    var newId = row + "Cond";
    
    if(document.getElementById(newId) != null) {
        table.deleteRow(index);
    }
}

function showAvgHot() {
    var statCity = document.getElementById("statCity").cells;
    
    var avg = parseFloat(statCity[3].innerHTML);
    var hot = avg;
    
    if(document.getElementById("dynCity").innerHTML != "") {
        var dynCity = document.getElementById("dynCity").cells;
        var dynTemp = parseFloat(dynCity[3].innerHTML);
        
        if(dynTemp > avg) {
            hot = dynTemp;
        }
        
        dynTemp = dynTemp / 2.0;
        avg = avg / 2.0;
        avg += dynTemp;
    }
    
    var string = "The average temperature is ";
    string += avg.toString();
    string += " and the hottest city is ";
    string += hot.toString();
    
    document.getElementById("avgAndHot").innerHTML = string;
}

function refresh() {
    reqStatCity();
    reqDynCity();
}

function forecast(row) {
    var rowClicked = row.cells;
    var city = rowClicked[0].innerHTML;
    
    var url = "http://api.apixu.com/v1/forecast.json?key=2d7f799bf7b34fd7b48200506182111&q=";
    url += city;
    
    fetch(url)
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonObj) {
            showForecast(jsonObj);
        })
        .catch(function(error) {
            showErr(error);
        });
}

function showForecast(jsonObj) {
    document.getElementById("err").innerHTML = "";
    var string = "";
    
    string += jsonObj.location.name + "'s forecast for tomorrow<br>";
    string += "Maximum Tempurature (C): " + jsonObj.forecast.forecastday[0].day.maxtemp_c + "<br>";
    string += "Minimum Tempurature (C): " + jsonObj.forecast.forecastday[0].day.mintemp_c + "<br>";
    string += "Average Tempurature (C): " + jsonObj.forecast.forecastday[0].day.avgtemp_c + "<br>";
    string += "Maximum Wind Speed (km/h): " + jsonObj.forecast.forecastday[0].day.maxwind_kph + "<br>";
    string += "Total Percipitation (mm): " + jsonObj.forecast.forecastday[0].day.totalprecip_mm + "<br>";
    string += "Average Visibility (km): " + jsonObj.forecast.forecastday[0].day.avgvis_km + "<br>";
    string += "Average Humidity: " + jsonObj.forecast.forecastday[0].day.avghumidity + "<br>";
    string += "Condition: " + jsonObj.forecast.forecastday[0].day.condition.text + "<br>";
    string += "UV Index: " + jsonObj.forecast.forecastday[0].day.uv + "<br>";
    string += "Sunrise: " + jsonObj.forecast.forecastday[0].astro.sunrise + "<br>";
    string += "Sunset: " + jsonObj.forecast.forecastday[0].astro.sunset + "<br>";
    string += "Moonrise: " + jsonObj.forecast.forecastday[0].astro.moonrise + "<br>";
    string += "Moonset: " + jsonObj.forecast.forecastday[0].astro.moonset + "<br>";
    
    document.getElementById("forcast").innerHTML = string;
}

function showErr(error) {
    var err = error;
    document.getElementById("err").innerHTML = err;
}