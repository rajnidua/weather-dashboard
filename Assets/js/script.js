var userFormEl = document.querySelector('#city-form');
var histFormE1 = document.querySelector('#prev-city-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#cityname');
var repoContainerEl = document.querySelector('#current-container');
var forecastContainerEl = document.querySelector('#forecast-container');
var forecastHeader = document.querySelector("#forecast-header");
var citySearchTerm = document.querySelector('#city-search-term');
var cnt = 6;
var forecastUl1 = document.createElement('ul');
var previousSearch = document.querySelector('#previous-search1');
var previousCity;
var myCity =  document.createElement('button');
var previousCities = [];
var previousCityArray = JSON.parse(localStorage.getItem("previousCities"));
var tempUnit = document.querySelector("input[name=temp]:checked").value;

//hide the forecast header when the app starts
forecastHeader.setAttribute("style","display:none;");

//display previous cities search history from local storage 
console.log("previous cities is "+previousCityArray);
if(previousCityArray=== null){
  previousCityArray=[];
}
if(previousCityArray!== null){
  for(var i=0;i<previousCityArray.length;i++){
    var myCity = document.createElement('button');
    myCity.textContent = previousCityArray[i];
    myCity.setAttribute("style","display:block;");
    myCity.setAttribute("class","btn");
    myCity.classList.add("prev-btn");
    myCity.setAttribute("id",previousCityArray[i]);
   
    previousSearch.appendChild(myCity);
  }
}

//on submit(city name) 
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = nameInputEl.value.trim();
  tempUnit = document.querySelector("input[name=temp]:checked").value;
  //check if city name is present in the list or not and append if not present
  if (cityname) {
    if(previousCityArray.includes(cityname)){
      console.log("cityname already inside array");
    }else{
      previousCityArray.push(cityname);
      console.log("The city array is"+previousCityArray);
      localStorage.setItem("previousCities", JSON.stringify(previousCityArray));
      var myCity = document.createElement('button');
      myCity.textContent = cityname;
      myCity.setAttribute("style","display:block;");
      myCity.setAttribute("class","btn");
      myCity.classList.add("prev-btn"); 
      myCity.setAttribute("id",cityname);
      
      previousSearch.appendChild(myCity);
    }
  getcityrepos(cityname);

  repoContainerEl.textContent = '';
  forecastContainerEl.textContent = '';
  nameInputEl.value = '';
  }else {
    alert('Please enter a city name or select from the list of search history');
  }
};


var getcityrepos = function (city) {
  console.log("fgbsfgnsf");
  //var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=75458c08fa474ac348f9900cc8ef4e74';
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=75458c08fa474ac348f9900cc8ef4e74';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(city);
            console.log(data);
            console.log(data[0].lat);
            console.log(data[0].lon);
            
            displayRepos(data, city);
        });
      }else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
}; 


var displayRepos = function (repos, searchTerm) {
  citySearchTerm.textContent = searchTerm;
  var myLatitude = repos[0].lat;
  var myLongitude = repos[0].lon;
  getFiveDayForecast(searchTerm,1,myLatitude,myLongitude);
};


function getFiveDayForecast(requestedCity,dayNumber,myLatitude,myLongitude){
  var myforecastapiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+myLatitude+'&lon='+myLongitude+'&cnt='+6+'&exclude=hourly,minutely' + '&units=' + tempUnit + '&appid=fabc0f3ee2df47776dc03eed2998269f';

  fetch(myforecastapiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          console.log(data);
          var currentImageIcon = document.createElement('img');
          var makeImageIcon = data.current.weather[0].icon;
          currentImageIcon.setAttribute("src","http://openweathermap.org/img/wn/"+makeImageIcon+".png");
          currentImageIcon.setAttribute("class","myIcon");
          citySearchTerm.textContent = requestedCity + "(" + calculateCityDate(data.current.dt) + ")" ;
          citySearchTerm.appendChild(currentImageIcon);
          
          var forecastUl = document.createElement('ul');
          console.log("I am inside forecast url "+data);

          var liTemp = document.createElement('li');
          if (tempUnit == "metric") {
            liTemp.textContent = "Temp: "+data.current.temp + "°C";
          }

          if (tempUnit == "imperial") {
            liTemp.textContent = "Temp: "+data.current.temp + "°F";
          }
          forecastUl.appendChild(liTemp);
      
          var liWind = document.createElement('li');
          liWind.textContent = "Wind: "+data.current.wind_speed + " MPH";
      
          forecastUl.appendChild(liWind);
      
          var liHumidity = document.createElement('li');
          liHumidity.textContent = "Humidity: "+data.current.humidity + " %";
      
          forecastUl.appendChild(liHumidity);

          var liUvIndex = document.createElement('li');
          liUvIndex.textContent = "UV Index: ";
          var UvButton = document.createElement('p');
          UvButton.textContent = data.current.uvi;
          liUvIndex.appendChild(UvButton);
          var uvIndex = data.current.uvi;
            if (uvIndex < 3) {
              UvButton.setAttribute("class","btn-green"); 
            }else if (uvIndex < 6) {
              UvButton.setAttribute("class","btn-yellow"); 
            }else if (uvIndex < 8) {
              UvButton.setAttribute("class","btn-orange");
            }else if (uvIndex < 11) {
              UvButton.setAttribute("class","btn-red"); 
            }else {
              UvButton.setAttribute("class","btn-purple"); 
            }
               
          forecastUl.appendChild(liUvIndex); 

          repoContainerEl.appendChild(forecastUl);

          getForecast(data);     
      });
      }
    });
}


//get the forecast weather information
function getForecast(data){
  forecastHeader.setAttribute("style","display:block;");
  for(var i=1;i<cnt;i++){
    var forecastUl1 = document.createElement('ul');
    calculateCityDate(data.daily[i].dt);
    
    var liDate = document.createElement('h3');
    liDate.textContent = calculateCityDate(data.daily[i].dt);
    forecastUl1.appendChild(liDate);

    var liImage = document.createElement('img');
    var makeImageIcon = data.daily[i].weather[0].icon + "@2x";
    liImage.setAttribute("src","http://openweathermap.org/img/wn/"+makeImageIcon+".png");
    forecastUl1.appendChild(liImage);

    var liTemp = document.createElement('li');

    if (tempUnit == "metric") {
      liTemp.textContent = "Temp: "+data.daily[i].temp.day + "°C";
    }

    if (tempUnit == "imperial") {
      liTemp.textContent = "Temp: "+data.daily[i].temp.day + "°F";
    }
    forecastUl1.appendChild(liTemp);

    var liWind = document.createElement('li');
    liWind.textContent = "Wind: "+data.daily[i].wind_speed + " MPH";
    forecastUl1.appendChild(liWind);

    var liHumidity = document.createElement('li');
    liHumidity.textContent = "Humidity: "+data.daily[i].humidity + " %";
    forecastUl1.appendChild(liHumidity);
    console.log(liHumidity.textContent); 

    if(i<cnt-1){
      forecastUl1.setAttribute("style","margin-right:20px;");
    }

  forecastContainerEl.appendChild(forecastUl1);
  }

}

//getting the date and changing it into the required format
function calculateCityDate(cityTimeZone){
  var localOffset = new Date(cityTimeZone * 1000);
  var dateFormatted = moment(localOffset).format("M/D/YYYY");
  console.log("local time is localOffset is "+localOffset+"AND THE FORMATTED IS "+dateFormatted+" parameter citi time zone is "+cityTimeZone); 
  return dateFormatted;
}

// Event Listener for History Search Button
userFormEl.addEventListener('submit', formSubmitHandler);

//selecting the button clicked
document.addEventListener('click', function (event) {
   // If the clicked element doesn't have the right selector, bail
  if (!event.target.matches('.prev-btn')) return;
  // Don't follow the link
  event.preventDefault();
  // Log the clicked element in the console
  console.log(event.target); 
  console.log(event.target.id);
  // call getcityrepos
  var scityname = event.target.id; 
  tempUnit = document.querySelector("input[name=temp]:checked").value;
  repoContainerEl.textContent = '';
  forecastContainerEl.textContent = '';
  nameInputEl.value = '';
  getcityrepos(scityname);
}, false);