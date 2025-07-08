import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { supabase } from "../services/supabase";

const Prestamos = () => {
  const { usuario, rolUsuario } = useContext(UserContext);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rolUsuario) return;

    const obtenerPrestamos = async () => {
      const { data, error } = await supabase.rpc(
        "obtener_prestamos_por_usuario",
        {
          p_id_usuario: usuario.id_usuario,
        }
      );

      if (error) {
        console.error("❌ Error al obtener préstamos:", error.message);
      } else {
        setPrestamos(data);
      }

      setLoading(false);
    };

    obtenerPrestamos();
  }, [rolUsuario]);

  const estadoTexto = (estado) => {
    if (estado === 1) return "📚 Prestado";
    if (estado === 2) return "✅ Devuelto";
    return "❓ Desconocido";
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mis Préstamos</h2>

      {loading ? (
        <p>Cargando préstamos...</p>
      ) : prestamos.length === 0 ? (
        <p>No tienes préstamos registrados.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Título</th>
              <th className="p-2">Autor</th>
              <th className="p-2">Fecha de retiro</th>
              <th className="p-2">Fecha de entrega</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id_prestamo} className="border-t">
                <td className="p-2">{prestamo.libros?.titulo}</td>
                <td className="p-2">{prestamo.libros?.autor}</td>
                <td className="p-2">{prestamo.fecha_prestamo}</td>
                <td className="p-2">{prestamo.fecha_devolucion}</td>
                <td className="p-2">{estadoTexto(prestamo.estado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Prestamos;
