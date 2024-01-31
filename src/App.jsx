import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState(null);
  const [weatherdata, setWeatherData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [history, setHistory] = useState([]);

  // const backgroundColor = (cond) => {
  //   if (cond === "clear") {
  //     return (backgroundColor = "Blue");
  //   }
  //   if (cond === "sunny") {
  //     return (backgroundColor = "yellow");
  //   }
  //   if (cond === "clear") {
  //     return (backgroundColor = "Blue");
  //   }
  // };

  const handleInputChange = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  };
  const submitSearchEnter = async (e) => {
    if (e.key === `Enter`) {
      e.preventDefault();
      setLoading(true);
      setSearch(searchValue);
    }
  };
  const clearInput = () => {
    setSearchValue("");
    setWeatherData(null);
    setError(null);
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearch(searchValue);
  };

  const apikey = "GET_YOUR kEY";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apikey}&units=metric`;
  const iconUrl = "https://openweathermap.org/img/wn/";

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const resp = await fetch(url);
          const data = await resp.json();
          console.log(data);

          if (data.cod && data.cod === "404") {
            // Stadt nicht gefunden
            setWeatherData(null);
            setError("City dont exist anymore");
          } else {
            const weatherInfo = {
              place: `Wetter in  ${data.name} ${data.sys.country}`,
              temp: `Live ${Math.round(data.main.temp)} °C`,
              feels: `Fühlt sich an wie ${Math.round(data.main.feels_like)} °C`,
              tempmin: `Tiefsttemperaturen  ${Math.round(
                data.main.temp_min
              )} °C`,
              tempmax: `Höchsttemperatur  ${Math.round(data.main.temp_max)} °C`,
              description: `${data.weather[0].description}`,
              wind: `Windgeschwindigkeit beträgt  ${data.wind.speed}`,
              icon: `${data.weather[0].icon}`,
            };
            setWeatherData(weatherInfo);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      setTimeout(fetchData, 1200);
    }
  }, [search]);

  return (
    <div className="App">
      <h1>Whetheria</h1>
      <input
        placeholder="Gib eine Stadt an..."
        onChange={handleInputChange}
        onKeyDown={submitSearchEnter}
        type="text"
        value={searchValue}
      />
      {searchValue && (
        <button className="clear-button" onClick={clearInput}>
          X
        </button>
      )}

      {<button onClick={submitSearch}>GO</button>}

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && weatherdata && searchValue && (
        <div className="datacontainer">
          <h2>{weatherdata.place}</h2>
          <img
            src={`${iconUrl}${weatherdata.icon}@2x.png`}
            alt="Weather Icon"
          />
          <p>{weatherdata.description}</p>
          <p>{weatherdata.temp}</p>
          <p>{weatherdata.feels}</p>
          <p>{weatherdata.tempmax}</p>
          <p>{weatherdata.tempmin}</p>
          <p>{weatherdata.wind}</p>
        </div>
      )}
    </div>
  );
}
export default App;
