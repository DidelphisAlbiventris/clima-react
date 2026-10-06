import { useEffect, useState } from "react";

function App() {
  const [texto, setTexto] = useState("");
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (texto.length < 3) {
      setDatos([]);
      setCargando(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const buscar = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(texto)}&count=5&language=es`,
          { signal: controller.signal }
        );

        if (!respuesta.ok) {
          throw new Error("Error en la petición");
        }

        const json = await respuesta.json();

        setDatos(json.results ?? []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        setCargando(false);
      }
    };

    buscar();

    return () => {
      controller.abort();
    };
  }, [texto]);

  return (
    <div>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      {cargando && <p>Buscando...</p>}

      {datos.length === 0 && texto.length >= 3 && !cargando && !error && (<p>No se encontraron coincidencias.</p>)}

      <ul>
        {datos.map((ciudad, index) => (
          <li key={index}>
            {ciudad.name}, {ciudad.admin1}, {ciudad.country}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;