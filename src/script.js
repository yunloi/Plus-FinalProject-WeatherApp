let now = new Date();

let displayDate = document.querySelector("h1");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let year = now.getFullYear();
let date = now.getDate();
let month = months[now.getMonth()];
let day = days[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

displayDate.innerHTML = `${day}, ${date} ${month} ${year}, ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastMaximumTemp = Math.round(forecastDay.temp.max);
      forecastMinimumTemp = Math.round(forecastDay.temp.min);

      forecastHTML =
        forecastHTML +
        `
              <div class="card col-2 forecast">
                <h5>${formatDay(forecastDay.dt)}</h5>
                <img src=
                "http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" class="icon" id="weather-icon" />
                <div class="row">
                  <div class="col-6">High</div>
                  <span class="col-6" id="forecast-max">${forecastMaximumTemp}°C</span>
                  <div class="col-6">Low</div>
                  <span class="col-6" id="forecast-min">${forecastMinimumTemp}°C</span>
                  <div class="col-6">Wind</div>
                  <span class="col-6">${Math.round(
                    forecastDay.wind_speed
                  )}m/s</span>
                </div>
              </div>
  `;
      forecastMaximum[index] = forecastMaximumTemp;
      forecastMinimum[index] = forecastMinimumTemp;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "a86e9d84a9cef96d075ec236ba74b9d6";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let currentTemperature = document.querySelector("#temperature-reading");
  celsiusTemperature = response.data.main.temp;
  currentTemperature.innerHTML = `${Math.round(celsiusTemperature)}`;
  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°C`;
  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°C`;
  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = `${Math.round(response.data.wind.speed)}m/s`;
  let humid = document.querySelector("#humid");
  humid.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  let currentCity = document.querySelector("#city-name");
  currentCity.innerHTML = `${response.data.name}`;
  let temperatureDescription = document.querySelector(
    "#temperature-description"
  );
  temperatureDescription.innerHTML = `${response.data.weather[0].description}`;
  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "a86e9d84a9cef96d075ec236ba74b9d6";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#search-city-input");
  searchCity(citySearchInput.value);
}

function retrieveLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "a86e9d84a9cef96d075ec236ba74b9d6";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrieveLocation);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureReading = document.querySelector("#temperature-reading");
  let maxTemp = document.querySelector("#max-temp");
  let minTemp = document.querySelector("#min-temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureReading.innerHTML = Math.round(fahrenheitTemperature);
  maxTemp.innerHTML = `${Math.round(fahrenheitTemperature)}°F`;
  minTemp.innerHTML = `${Math.round(fahrenheitTemperature)}°F`;

  for (let i = 0; i < 6; i++) {
    let fMaxTemp = document.querySelectorAll("#forecast-max")[i];
    fMaxTemp.innerHTML = `${Math.round((forecastMaximum[i] * 9) / 5) + 32}°F`;
    let fMinTemp = document.querySelectorAll("#forecast-min")[i];
    fMinTemp.innerHTML = `${Math.round((forecastMinimum[i] * 9) / 5) + 32}°F`;
  }
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureReading = document.querySelector("#temperature-reading");
  let maxTemp = document.querySelector("#max-temp");
  let minTemp = document.querySelector("#min-temp");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureReading.innerHTML = Math.round(celsiusTemperature);
  maxTemp.innerHTML = `${Math.round(celsiusTemperature)}°C`;
  minTemp.innerHTML = `${Math.round(celsiusTemperature)}°C`;

  for (let i = 0; i < 6; i++) {
    let fMaxTemp = document.querySelectorAll("#forecast-max")[i];
    fMaxTemp.innerHTML = `${Math.round(forecastMaximum[i])}°C`;
    let fMinTemp = document.querySelectorAll("#forecast-min")[i];
    fMinTemp.innerHTML = `${Math.round(forecastMinimum[i])}°C`;
  }
}

let form = document.querySelector("#search-city-form");
form.addEventListener("submit", handleSubmit);

let button = document.querySelector("#current-button");
button.addEventListener("click", getCurrentPosition);

let celsiusTemperature = null;

let forecastMaximum = [];
let forecastMinimum = [];

let fahrenheitLink = document.querySelector("#link-fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#link-celsius");
celsiusLink.addEventListener("click", showCelsiusTemperature);

searchCity("Sydney");
