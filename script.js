const openWeatherApi = "656b6b1ef6d814cfb3a22335943f234d"
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeatherDeatils(latitude,longitude)
      getForecastDeatils(latitude,longitude)
    },
    function (error) {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}
async function getDetails(){
  let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${document.querySelector('input').value}&limit=1&appid=${openWeatherApi}`);
  let data = await response.json();
  let lat = data[0].lat;
  let long = data[0].lon;
  getWeatherDeatils(lat,long);
  getForecastDeatils(lat,long);
}
let getWeatherDeatils = async (lat,long) => {
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&appid=${openWeatherApi}`);
  let data = await response.json();
  loadWeatherDetails(data);
};
let getForecastDeatils = async (lat,long) => {
  let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${openWeatherApi}&units=metric`);
  let data = await response.json();
  loadForecastDetails(data);
};
let loadWeatherDetails = (current) => {
  document.querySelector('.place').innerHTML = current.name;
  document.querySelector('.date').innerHTML = getDate(current.dt);
  document.querySelector('.temp').innerHTML = `${Math.round(current.main.temp)}°`;
  document.querySelector('.realtemp').innerHTML = `Feels Like ${Math.round(current.main.feels_like)}°`;
  document.querySelector('.desc').innerHTML = current.weather[0].description;
  document.querySelector('.conditions').innerHTML = 
  `<div class="condition">
        <p class="attribute">Wind</p>
        <p class="value">${current.wind.speed}km/hr</p>
      </div>
      <div class="condition">
        <p class="attribute">Humidity</p>
        <p class="value">${current.main.humidity}%</p>
      </div>
      <div class="condition">
        <p class="attribute">Pressure</p>
        <p class="value">${current.main.humidity}pa</p>
      </div>
      <div class="condition">
        <p class="attribute">Clouds</p>
        <p class="value">${current.clouds.all}%</p>
  </div>`
}
let loadForecastDetails = (forecast) => {
  let html = "";
  for(let i=0;i<40;i+=8){
    html = html + 
    `<div class="day">
      <p>${getDay(forecast.list[i].dt)}</p>
      <img src="https://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@2x.png" alt="">
      <p>${forecast.list[i].main.temp}°</p>
      <div class="highlow">
        <p>H: ${forecast.list[i].main.temp_min}°</p>
        <p>L: ${forecast.list[i].main.temp_max}°</p>
      </div>
    </div>`
  }
  document.querySelector('.forecast').innerHTML=html;
}
let getDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}
let getDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'long'};
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}
document.addEventListener('keydown' ,(event) => {
  if(event.key === 'Enter')
    getDetails();
});