import { fetchCountries } from "../api/countries.js";
import { fetchWeather } from "../api/weather.js";

export async function createContent() {
  const content = document.createElement("main");
  content.classList.add("content");

  // Fetch country data
  const countries = await fetchCountries();

  // The amount of countries to display
  const slicedCountries = countries.slice(100, 185);

  // Sort the countries alphabetically using English locale
  const displayedCountries = slicedCountries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common, "en", { sensitivity: "base" })
  );

  const countryList = document.createElement("ul");

  // Loop through the sorted subset of countries
  displayedCountries.forEach((country) => {
    const li = document.createElement("li");
    li.textContent = country.name.common;

    // Create a div for weather info inside each li
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather-info");
    weatherDiv.textContent = "Loading weather data..."; // Placeholder text
    li.appendChild(weatherDiv);

    // Append the list item to the DOM immediately
    countryList.appendChild(li);

    // Fetch and display the weather asynchronously after appending the li element
    if (country.capitalInfo && country.capitalInfo.latlng) {
      const [lat, lon] = country.capitalInfo.latlng;
      fetchWeatherAndUpdate(
        li,
        lat,
        lon,
        country.capital ? country.capital[0] : "Capital"
      );
    } else {
      weatherDiv.textContent = "Weather data not available.";
    }
  });

  content.appendChild(countryList);
  return content;
}

// Separate function to fetch weather and update the DOM
async function fetchWeatherAndUpdate(li, lat, lon, capital) {
  const weatherDiv = li.querySelector(".weather-info");
  try {
    const weather = await fetchWeather(lat, lon);
    weatherDiv.innerHTML = `
      Weather in ${capital}: 
      ${weather.current_weather.temperature}°C, Code: ${weather.current_weather.weathercode}
    `;
  } catch (error) {
    console.error("Error fetching weather", error);
    weatherDiv.textContent = "Weather data not available.";
  }
}
