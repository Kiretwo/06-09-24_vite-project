import { fetchCountries } from "../api/countries.js";
import { fetchWeather } from "../api/weather.js";

export async function createContent() {
  const content = document.createElement("main");
  content.classList.add("content");

  // Fetch and display country data
  const countries = await fetchCountries();
  //console.log(countries);

  const countryList = document.createElement("ul");

  countries.slice(175, 185).forEach(async (country) => {
    const li = document.createElement("li");
    li.textContent = country.name.common;

    // Create a div for weather info inside each li
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather-info");
    li.appendChild(weatherDiv);

    // Event listener to fetch weather when country is clicked
    if (country.capitalInfo && country.capitalInfo.latlng) {
      const [lat, lon] = country.capitalInfo.latlng;
      try {
        const weather = await fetchWeather(lat, lon);
        weatherDiv.innerHTML = `
          Weather in ${country.capital ? country.capital[0] : "Capital"}: 
          ${weather.current_weather.temperature}°C, Code: ${weather.current_weather.weathercode}
        `;
      } catch (error) {
        console.error("Error fetching weather", error);
        weatherDiv.textContent = "Weather data not available.";
      }
    } else {
      weatherDiv.textContent = "Weather data not available.";
    }

    countryList.appendChild(li);
  });

  content.appendChild(countryList);
  return content;
}
