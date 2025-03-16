import { kelvinToCelsius, kelvinToFahrenheit } from "./utils.js";

const bodyElement = document.querySelector("body")
const darkModeToggle = document.querySelector(".checkbox");
const API_KEY = "82b044c3f2b7330f8c49cf01232936fe"
let cityName = ''

//Toggle dark mode
darkModeToggle.addEventListener("change", (event)=>{
    if(event.target.checked){
        bodyElement.classList.add("darkmode")
    }else{
        bodyElement.classList.remove("darkmode")
    }
}
)

//TO D0 :
// Add error if empty search box is submitted
//Add loading state when data is fetched
//Make ReadMe
//Dropdown with valid cities as you type
//Clean up code 

const inputElement = document.querySelector('.city-input-box')
const searchButton = document.querySelector('.search-button');
const dropdownElement = document.querySelector('.dropdown')

const getInputValue = () =>{
    const inputElement = document.querySelector(".city-input-box");
    if(inputElement.value.length === 0){
        //Better error message goes here
        alert('fill it o')
    }else{
        cityName = inputElement.value.trim().replace(/[^a-zA-Z ]/g, "");
        cityName =  cityName.charAt(0).toUpperCase() + cityName.slice(1);
        console.log(`city name: ${cityName}`)
    }
}

searchButton.addEventListener('click', ()=>{
    getInputValue();
    getWeatherData(cityName)
})

inputElement.addEventListener('keydown', (event)=>{
    if(event.key === "Enter"){
        getInputValue()
        getWeatherData(cityName)
    }
})

const displayData = (data) => {
    const tempValueElement = document.querySelector('.temp-value')
    const cityNameElement = document.querySelector('.city-name')
    const pressureValueElement = document.querySelector('.pressure-value')
    const humidityValueElement = document.querySelector('.humidity-value')
    const weatherConditionElement = document.querySelector('.weather-condition')
    

    //checks what option is selected when the user first loads the page
    if (dropdownElement.value === "celsius"){
        tempValueElement.textContent = `${Math.round(kelvinToCelsius(data.main.temp))}°C`
    } else {
        tempValueElement.textContent = `${Math.round(kelvinToFahrenheit(data.main.temp))}°F`
    }

     //checks what option is selected when the user selects a differnt option from the dropdown
    dropdownElement.addEventListener('change', ()=>{   
    if (dropdownElement.value === "celsius"){
        tempValueElement.textContent = `${Math.round(kelvinToCelsius(data.main.temp))}°C`
    } else {
        tempValueElement.textContent = `${Math.round(kelvinToFahrenheit(data.main.temp))}°F`
    }
    })

    cityNameElement.textContent = `${data.name}`
    humidityValueElement.textContent = `${(data.main.humidity)}%`
    pressureValueElement.textContent = `${data.main.pressure}hPa`
    weatherConditionElement.textContent = `Weather condition: ${data.weather[0].description}`

}


const getWeatherData = async (cityName) =>{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)

    displayData(data)
}

// Function to fetch weather data by user's location
const getWeatherByLocation = async (latitude, longitude) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Location Weather Data:", data);
        displayData(data);
    } catch (error) {
        console.error("Error fetching location weather data:", error);
    }
};

// Get user's location on page load
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Location access denied. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

window.addEventListener("load", getUserLocation);
