import { useState } from "react";
import useFetch from "./hooks/useFetch";
import { describirClima } from "./clima";

// Pues la he liado con el commit anterior
function App() {
  const [texto, setTexto] = useState("");
  const [ciudad, setCiudad] = useState(null);
  const urlCiudad =
    texto.length >= 3
      ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          texto
        )}&count=5&language=es`
      : null;

  const { datos: datosCiudades, cargando: cargandoCiudades, error: errorCiudades } = useFetch(urlCiudad);

  const ciudades = datosCiudades?.results ?? [];

  const urlPronostico =ciudad ? `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.latitude}&longitude=${ciudad.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`: null;
console.log("URL pronóstico:", urlPronostico);
  const {datos: pronostico, cargando: cargandoClima, error: errorClima } = useFetch(urlPronostico);



  return (
    <div>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {cargandoCiudades && <p>Buscando...</p>}
      {cargandoCiudades && <p>Buscando...</p>}
      {errorCiudades && <p>Error: {errorCiudades.message}</p>}
      {texto.length >= 3 &&
        !cargandoCiudades &&
        !errorCiudades &&
        ciudades.length === 0 && <p>No se encontró ninguna ciudad</p>}

      <ul>
        {ciudades.map((ciudad) => (
          <li key={ciudad.id} onClick={()=>setCiudad(ciudad)} style={{ cursor: "pointer" }}>
            {ciudad.name}, {ciudad.admin1}, {ciudad.country}
            
          </li>
        ))}
      </ul>
      {cargandoClima && <p>Cargando clima...</p>}
      {errorClima && <p>Error al cargar el clima: {errorClima.message}</p>}

      {ciudad && pronostico && pronostico.current && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <h2>Clima actual en {ciudad.name}</h2>
          <p>Temperatura: {pronostico.current.temperature_2m}°C</p>
          <p>Condición: {""} {describirClima(pronostico.current.weather_code)}</p>
          <p>Viento: {pronostico.current.wind_speed_10m} km/h</p>
          <h3>Próximos 7 días</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {pronostico.daily.time.map((fecha, index) => (
              <div key={fecha} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px", minWidth: "120px" }}>
                <p style={{ margin: "5px"}}>{fecha}</p>
                <p style={{ margin: "5px"}}>{describirClima(pronostico.daily.weather_code[index])}</p>
                <p style={{ margin: "0", color: "red" }}> Máx: {pronostico.daily.temperature_2m_max[index]}°C</p>
                <p style={{ margin: "0", color: "blue" }}> Mín: {pronostico.daily.temperature_2m_min[index]}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;