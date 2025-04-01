import { useState, useEffect } from "react";
import "./App.css";
import searchIcon from "./assets/Search.png";
import clearIcon from "./assets/Sun.png";
import cloudIcon from "./assets/Clear.png";
import fewcloudIcon from "./assets/Cloud.png";
import clearnIcon from "./assets/Cloud Night.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidity (2).png";
import brokenIcon from "./assets/broken clouds.png";
const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="lat">
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-speed">{wind} Km/h</div>
          </div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </>
  );
};



function App() {
  let api_key = "ae51503c1f1a2a8357632b423ca8a3b7";
  const [text , setText] = useState("Chennai");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d" : clearIcon,
    "01n" : clearnIcon,
    "02d" : fewcloudIcon,
    "02n" : fewcloudIcon,
    "03d" : cloudIcon,
    "03n" : cloudIcon,
    "04d" : brokenIcon,
    "04n" : brokenIcon,
    "09d" : drizzleIcon,
    "09n" : drizzleIcon,
    "10d" : rainIcon,
    "10n" : rainIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
  }

  const search = async ()=> { 
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      if(data.cod == "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch (error){
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.")
    }finally{
      setLoading(false);
    }

  }
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function (){
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="Input-container">
          <input
            type="text"
            className="input-text"
            placeholder="Search a city"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search" onClick={() => search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
       {cityNotFound && <div className="city-not-found">City not found</div>}

       {!loading && !cityNotFound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity = {humidity}
          wind = {wind}
        />}
      </div>
    </>
  );
}

export default App;
