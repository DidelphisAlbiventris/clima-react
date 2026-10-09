import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setDatos(null);
      setError(null);
      setCargando(false);
      return;
    }

    const controller = new AbortController();

    const buscar = async () => {
      setCargando(true);
      setError(null);
      setDatos(null);
    try {
    const respuesta = await fetch(url, { signal: controller.signal });

    if (!respuesta.ok) {
        throw new Error("Error en la petición");
    }

    const json = await respuesta.json();
    setDatos(json);
    } catch (err) {
    if (err.name !== "AbortError") {
        setError(err);
    }
    } finally {
    if (!controller.signal.aborted) {
        setCargando(false);
    }
    }
    };

    buscar();

    return () => controller.abort();
  }, [url]);

  return { datos, cargando, error };
}