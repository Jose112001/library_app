import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalPrestamo from "../components/ModalPrestamos";
import { UserContext } from "../context/UserContext";
import { supabase } from "../services/supabase";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const { usuario, rolUsuario } = useContext(UserContext);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const obtenerLibros = async () => {
      
      const { data, error } = await supabase
        .from("libros")
        .select("*")
        .order("titulo", { ascending: true });

      if (error) {
        console.error("Error al obtener libros:", error.message);
      } else {
        setLibros(data);
        setLibrosFiltrados(data);
      }
      setLoading(false);
    };

    obtenerLibros();
  }, []);

  useEffect(() => {
    const filtro = libros.filter((libro) =>
      `${libro.titulo} ${libro.autor}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
    setLibrosFiltrados(filtro);
  }, [busqueda, libros]);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Listado de Libros</h2>
      {console.log("rol")}
      {console.log(rolUsuario)}
      {rolUsuario?.id_rol === 2 && (
        <div className="mb-4">
          <Link
            to="/libros/agregar"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Agregar Libro
          </Link>
        </div>
      )}
      <input
        type="text"
        placeholder="Buscar por título o autor..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {loading ? (
        <p>Cargando libros...</p>
      ) : librosFiltrados.length === 0 ? (
        <p>No se encontraron libros.</p>
      ) : (
        <ul className="space-y-3">
          {librosFiltrados.map((libro) => (
            <li
              key={libro.id} // ✅ Agrega la key aquí
              className="p-3 border rounded hover:bg-gray-100 transition"
            >
              <h3 className="font-semibold">{libro.titulo}</h3>
              <p>Autor: {libro.autor}</p>
              <p>
                Año: {libro.anio_publicacion} | ISBN: {libro.isbn} |{" "}
                {libro.disponible ? "✅ Disponible" : "❌ Prestado"}
              </p>
            </li>
          ))}
        </ul>
      )}
      {mostrarModal && libroSeleccionado && (
        <ModalPrestamo
          libro={libroSeleccionado}
          usuario={usuario}
          onClose={() => setMostrarModal(false)}
          onSuccess={() => {
            setLibroSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default Libros;
