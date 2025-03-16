import { kelvinToCelsius, kelvinToFahrenheit } from "./utils.js";

const bodyElement = document.querySelector("body")
const darkModeToggle = document.querySelector(".checkbox");
const API_KEY = "82b044c3f2b7330f8c49cf01232936fe";

const mainImage = document.querySelector('.main-image')
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

// Show loader function
const showLoader = () => {
    loader.style.display = "block";
    document.querySelector(".result-display").style.display = "none";
    document.querySelector(".extra-info").style.display = "none";
};

// Hide loader function
const hideLoader = () => {
    loader.style.display = "none";
    document.querySelector(".result-display").style.display = "flex";
    document.querySelector(".extra-info").style.display = "flex";
};

const inputElement = document.querySelector('.city-input-box')
const searchButton = document.querySelector('.search-button');
const dropdownElement = document.querySelector('.dropdown');
const loader = document.querySelector(".loader");


function showToast(message, type) {
    const toastBox = document.querySelector(".toastBox");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="material-icons">${type === "success" ? "check_circle" : type === "error" ? "error" : "warning"}</i>
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

const getInputValue = () =>{
    const inputElement = document.querySelector(".city-input-box");
    cityName = inputElement.value.trim().replace(/[^a-zA-Z ]/g, "");
    cityName =  cityName.charAt(0).toUpperCase() + cityName.slice(1);
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

const displayMatchingImage = (data) =>{
    const descriptionId = data.weather[0].id
    if (descriptionId >= 200 && descriptionId <= 299) {
        mainImage.src = "./assets/cloud-with-lightening-and-rain.svg";
    } else if (descriptionId >= 300 && descriptionId <= 399) {
        mainImage.src = "./assets/light-drizzle.svg"; // Drizzle
    } else if (descriptionId >= 500 && descriptionId <= 599) {
        mainImage.src = "./assets/cloud-with-rain.svg"; // Rain
    } else if (descriptionId >= 600 && descriptionId <= 699) {
        mainImage.src = "./assets/cloud-with-snowflake.svg"; // Snow
    } else if (descriptionId >= 700 && descriptionId <= 799) {
        mainImage.src = "./assets/windy-weather.svg"; // Mist, smoke, haze, fog
    } else if (descriptionId === 800) {
        mainImage.src = "./assets/partly-cloudy.svg"; // Clear sky
    } else if (descriptionId >= 801 && descriptionId <= 810) {
        mainImage.src = "./assets/cloudy.svg"; // Cloudy (partly cloudy to overcast)
    } else {
        mainImage.src = "/assets/partly-cloudy.svg"; // Default image for unknown conditions
    }

    const imageSrc = mainImage.src;

    const tempValueElement = document.querySelector('.temp-value')

    if (imageSrc.includes("partly-cloudy")) {
        tempValueElement.style.marginTop = "-40px";
    } else {
        tempValueElement.style.marginTop = "0px";
    }
};

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

    displayMatchingImage(data)
   
}

const getWeatherData = async (cityName) => {
    if (!cityName) {
        showToast("Please enter a city name", "error");
        return;
    }
    showLoader();
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json(); 

        if (!response.ok) {
            showToast(` ${data.message}`, "error");
            return;
        }
        displayData(data);

    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
            showToast("Network error: Check your internet connection.", "error");
        } else {
            showToast("Unexpected error occurred. Please try again later.", "error");
        }
    } finally {
        hideLoader();
    }
};


// Function to fetch weather data by user's location
const getWeatherByLocation = async (latitude, longitude) => {
    showLoader();

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Location Weather Data:", data);
        displayData(data);
    } catch (error) {
        console.error("Error fetching location weather data:", error);
    } finally {
        hideLoader();
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