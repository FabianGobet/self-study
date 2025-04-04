document.addEventListener("DOMContentLoaded", function () {
    const inputCity = document.getElementById("city-input");
    const weatherButton = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityName = document.getElementById("city-name");
    const temperatureInfo = document.getElementById("temperature");
    const description = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");

    const API_KEY = "de7eda5bfd792c35c407288341fbab92";

    weatherButton.addEventListener("click", async () => {
        const city = inputCity.value.trim();
        if (!city) return;

        try {
            const weatherdata = await fetchWeatherData(city);
            displayWeatherData(weatherdata);
        } catch (error) {
            console.error(error);
            showError(error.message);
        }
    });

    async function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        return data;
    }

    function displayWeatherData(weatherData) {
        const { name, main, weather } = weatherData;
        cityName.textContent = name;
        temperatureInfo.textContent = `Temperature: ${main.temp} °C`;
        description.textContent = `Weather: ${weather[0].description}`;
        weatherInfo.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    }

    function showError(message) {
        errorMessage.textContent = message;
        weatherInfo.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
});
