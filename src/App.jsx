import useFetch from "./hooks/useFetch";
import { useState } from "react";

function App() {
  const [texto, setTexto] = useState("");

  const url =
    texto.length >= 3
      ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          texto
        )}&count=5&language=es`
      : null;

  const { datos, cargando, error } = useFetch(url);

  return (
    <div>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      {cargando && <p>Buscando...</p>}

      {error && <p>Error: {error.message}</p>}

      <ul>
        {datos.map((ciudad) => (
          <li key={ciudad.id}>
            {ciudad.name}, {ciudad.admin1}, {ciudad.country}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;