// Geocoding API (Nominatim)
const geocodingApiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
const geocodingCityPlzApiUrl = "https://nominatim.openstreetmap.org/search?format=json";
// Beispiel:
// https://nominatim.openstreetmap.org/search?format=json&q=Berlin

// Wetter API (Open-Meteo)
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?current_weather=true&";
// Beispiel (Koordinaten für Berlin):
// https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=48.3&longitude=14.2799

class WeatherData {
    constructor(weathercode, temperature) {
        this.weathercode = weathercode;
        this.temperature = temperature;
    }
}

class LocationData {
    constructor(longitude, latitude, cityname) {
        this.longitude= longitude;
        this.latitude = latitude;
        this.cityname = cityname; //(display_name) //vll nur name hier nehmen??
    }
}

const cityInput = document.getElementById("cityInput");
const zipInput = document.getElementById("zipInput");
const weatherDesc = document.getElementById("descDisplay");
const weatherIcon = document.getElementById("weatherDisplay");
const displayCard = document.getElementById("infoDisplay");
const errorDispl = document.getElementById("errorDisplay");

// -- Hauptfunktion -- \\ wird durhc Button gestartet
async function searchWeather() {
    event.preventDefault();

    const city = cityInput.value;
    const plz = zipInput.value;

    cityInput.value="";
    zipInput.value="";

    try {
        const locationData = await getCoordinates(city,plz);
        const weatherData = await fetchWeatherData(locationData);
        updateWeatherData(weatherData,locationData);
    } catch (error) {
        console.error("Fehler beim Abfragen des Wetters: ", error);
        displayCard.style.display ="none";
        errorDispl.style.display = "flex";
    }
}

function updateWeatherData(weatherData,locationData) {
    errorDispl.style.display= "none";
    displayCard.style.display = "flex";

    weatherIcon.src = `icons/${getWeatherIcon(weatherData.weathercode)}`;
    weatherDesc.textContent = getWeatherDescription(weatherData.weathercode);
    //showTemperature(weatherData.temperature);
    document.getElementById("cityDisplay").innerText = locationData.cityname;
    document.getElementById("tempDisplay").innerText = (weatherData.temperature + " °C");
}

function getCoordinates(city,plz) {
    //alternative Schreibweise anstatt des Promise //muss dann aber auch vor die function async schreiben
    /*
    const url = ....; //URL einspeichern
    const data = await fetch(url);
    const json = await data.json();

     */
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&city=${city}&postalcode=${plz}`)

        //Mit promises
        .then((data) => data.json())//speichert das data (was von der fetch datei geholt wird) als json ab// macht neues promise, weils wieder dauert
            .then((json) =>{ //das json wird jetzt in diese variable gespeichert

                const lon = json[0].lon
                const lat = json[0].lat
                const displayName = json[0].display_name

                console.log("Ausgabe des Ortes: " + displayName)
                console.log(json)
                return new LocationData(lon, lat, displayName)
            })
}

function fetchWeatherData(locationData) {
    return fetch(`https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=${locationData.latitude}&longitude=${locationData.longitude}`)
        .then((data)=>data.json())
            .then((json)=> {
                const weathercode = json.current_weather.weathercode
                const temperature = json.current_weather.temperature

                console.log("Wettercode: " + weathercode + " | Temperatur: "+ temperature)
                return new WeatherData(weathercode, temperature)
            })
}

function getWeatherIcon(weathercode) {
    let iconName;
    switch (weathercode) {
        case 0:
            iconName = "clear-day.svg";
            displayCard.style.background = "linear-gradient(180deg, rgba(100, 205, 237, 0.58), rgba(239, 175, 67, 0.4))";

            break;
        case 1:
        case 2:
        case 3:
            iconName = "partly-cloudy-day.svg";
            displayCard.style.background = "linear-gradient(180deg, rgba(66, 154, 181, 0.58), rgba(188, 180, 171, 0.4))";
            break;
        case 45:
        case 48:
            iconName = "fog.svg";
            displayCard.style.background = "linear-gradient(180deg, rgba(150, 154, 156, 0.58), rgba(239, 236, 232, 0.4))";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            iconName = "rain.svg";
            displayCard.style.background = "linear-gradient(180deg, rgba(5, 44, 142, 0.58), rgba(20, 70, 198, 0.4))";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            iconName = "snow.svg";
            displayCard.style.background = "linear-gradient(180deg, rgba(233, 240, 243, 0.58), rgba(141, 199, 241, 0.4))";
            break;
        case 95:
        case 96:
        case 99:
            iconName = "thunderstorms.svg";
            break;
        default:
            iconName = "unknown.svg"; // Füge ein Icon für unbekannte Wettercodes hinzu
    }
    return iconName;
}

function getWeatherDescription(weathercode) {
    const weatherDescriptions = {
        0: "Klarer Himmel",
        1: "Leicht bewölkt",
        2: "Teilweise bewölkt",
        3: "Bewölkt",
        45: "Nebel",
        48: "Ablagerungsnebel",
        51: "Leichter Nieselregen",
        53: "Mäßiger Nieselregen",
        55: "Starker Nieselregen",
        56: "Leichter gefrierender Nieselregen",
        57: "Starker gefrierender Nieselregen",
        61: "Leichter Regen",
        63: "Mäßiger Regen",
        65: "Starker Regen",
        66: "Leichter gefrierender Regen",
        67: "Starker gefrierender Regen",
        71: "Leichter Schneefall",
        73: "Mäßiger Schneefall",
        75: "Starker Schneefall",
        77: "Schneeregen",
        80: "Leichte Regenschauer",
        81: "Mäßige Regenschauer",
        82: "Starke Regenschauer",
        85: "Leichte Schneeschauer",
        86: "Starke Schneeschauer",
        95: "Gewitter",
        96: "Gewitter mit Hagel",
        99: "Gewitter mit starkem Hagel"
    };
    return weatherDescriptions[weathercode] || "Unbekannt";
}