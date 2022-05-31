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

function showTemperature(response) {
  let currentTemperature = document.querySelector("#temperature-reading");
  currentTemperature.innerHTML = `${Math.round(response.data.main.temp)}`;
  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}℃`;
  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}℃`;
  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = `${Math.round(response.data.wind.speed)}m/s`;
  let humid = document.querySelector("#humid");
  humid.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  let currentCity = document.querySelector("#city-name");
  currentCity.innerHTML = `${response.data.name}`;
}

function searchCity(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#search-city-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = `${citySearchInput.value}`;
  let apiKey = "a86e9d84a9cef96d075ec236ba74b9d6";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${citySearchInput.value}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
let form = document.querySelector("#search-city-form");
form.addEventListener("submit", searchCity);

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

let button = document.querySelector("#current-button");
button.addEventListener("click", getCurrentPosition);
