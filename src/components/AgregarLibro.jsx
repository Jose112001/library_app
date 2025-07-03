import React, { useState, useContext } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AgregarLibro = () => {
  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
    genero: "",
    isbn: "",
    cantidad_total: 1,
    cantidad_disponible: 1,
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  const [mensaje, setMensaje] = useState("");
  const [buscando, setBuscando] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro({ ...libro, [name]: value });
  };

  const buscarPorISBN = async () => {
    try {
      const isbnLimpio = libro.isbn.replace(/-/g, "");
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

      //WorldCat
      const WcRes = await fetch(`https://search.worldcat.org/es/search?q=${isbnLimpio}&offset=1`)

      console.log(WcRes);
      // Intenta con Google Books
      const googleRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnLimpio}&key=${GOOGLE_API_KEY}`
      );
      const googleData = await googleRes.json();

      if (googleData.totalItems > 0) {
        const item = googleData.items[0].volumeInfo;
        setLibro((prev) => ({
          ...prev,
          titulo: item.title || "",
          autor: item.authors?.[0] || "",
          genero: item.categories?.[0] || "",
        }));
        return;
      }

      // Si Google falla, intenta con OpenLibrary
      const openRes = await fetch(
        `https://openlibrary.org/isbn/${isbnLimpio}.json`
      );
      if (openRes.ok) {
        const data = await openRes.json();
        const titulo = data.title || "";
        const authorKey = data.authors?.[0]?.key;
        const workKey = data.works?.[0]?.key;

        const autor = authorKey ? await obtenerAutor(authorKey) : "";
        const genero = workKey ? await obtenerGenero(workKey) : "";

        setLibro((prev) => ({
          ...prev,
          titulo,
          autor,
          genero,
        }));
        return;
      }

      throw new Error("Libro no encontrado en fuentes públicas");
    } catch (error) {
      console.error("Error buscando el libro:", error);
      setMensaje("❌ No se pudo encontrar información del libro");
    }
  };

  const obtenerAutor = async (key) => {
    const res = await fetch(`https://openlibrary.org${key}.json`);
    const data = await res.json();
    return data.name || "";
  };

  const obtenerGenero = async (key) => {
    const res = await fetch(`https://openlibrary.org${key}.json`);
    const data = await res.json();
    return data.subjects?.[0] || ""; // puedes usar más de uno si lo deseas
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("libros").insert([libro]);

    if (error) {
      setMensaje("❌ Error al agregar el libro: " + error.message);
    } else {
      setMensaje("✅ Libro agregado correctamente");
      setTimeout(() => navigate("/libros"), 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📘 Agregar Nuevo Libro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            name="isbn"
            value={libro.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={buscarPorISBN}
            className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
            disabled={buscando}
          >
            {buscando ? "Buscando..." : "Buscar ISBN"}
          </button>
        </div>

        <input
          name="titulo"
          value={libro.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="autor"
          value={libro.autor}
          onChange={handleChange}
          placeholder="Autor"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="genero"
          value={libro.genero}
          onChange={handleChange}
          placeholder="Género"
          className="w-full p-2 border rounded"
        />
        <input
          name="cantidad_total"
          type="number"
          value={libro.cantidad_total}
          onChange={handleChange}
          placeholder="Cantidad total"
          className="w-full p-2 border rounded"
          min={0}
          required
        />
        <input
          name="cantidad_disponible"
          type="number"
          value={libro.cantidad_disponible}
          onChange={handleChange}
          placeholder="Cantidad disponible"
          className="w-full p-2 border rounded"
          min={0}
          required
        />
        <input
          name="fecha_ingreso"
          type="date"
          value={libro.fecha_ingreso}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar libro
        </button>
        {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
      </form>
    </div>
  );
};

export default AgregarLibro;
