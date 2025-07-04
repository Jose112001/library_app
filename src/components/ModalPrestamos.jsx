import { useEffect, useState } from "react";
import "../assets/css/ModalPrestamo.css";
import { supabase } from "../services/supabase";

const ModalPrestamo = ({ libro, usuario, onClose, onExito }) => {
  const [fechaRetiro, setFechaRetiro] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  useEffect(() => {
    if (fechaRetiro) {
      const retiro = new Date(fechaRetiro);
      retiro.setDate(retiro.getDate() + 7);
      setFechaEntrega(retiro.toISOString().split("T")[0]);
    }
  }, [fechaRetiro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Libro recibido en modal:", libro);
    console.log("Libro recibido en modal:", usuario.user_metadata);
    if (!libro?.cantidad_disponible || isNaN(libro.cantidad_disponible)) {
      alert(
        "⚠️ No se puede registrar el préstamo: cantidad disponible inválida."
      );
      return;
    }
     const { data: dataUsu, error: errorUsu } = await supabase
        .from("usuarios")
        .select("id_usuario, nombre")
        .eq("id_auth", usuario.id)
        .single();
    console.log(dataUsu);

    //Registrar préstamo
    const { error: errorPrestamo } = await supabase.from("prestamos").insert([
      {
        id_usuario: dataUsu.id_usuario,
        id_libro: libro.id_libro,
        fecha_prestamo: fechaRetiro,
        fecha_devolucion: fechaEntrega,
        estado: 1, // 1:prestado, 2:disponible
      },
    ]);

    if (errorPrestamo) {
      alert("❌ Error al registrar el préstamo: " + errorPrestamo.message);
      return;
    }

    //Actualizar cantidad_disponible
    const nuevaCantidad = libro.cantidad_disponible - 1;
    

    const { error: errorUpdate } = await supabase
      .from("libros")
      .update({ cantidad_disponible: nuevaCantidad })
      .eq("id_libro", libro.id_libro);

    if (errorUpdate) {
      alert(
        "⚠️ Préstamo registrado, pero no se actualizó el inventario: " +
          errorUpdate.message
      );
      return;
    }

    alert("✅ Préstamo registrado correctamente.");
    onExito();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>📚 Solicitar Préstamo</h2>
        <form onSubmit={handleSubmit} className="form">
          <div>
            <strong>Título:</strong> {libro.titulo}
          </div>
          <div>
            <strong>Autor:</strong> {libro.autor}
          </div>

          <label>
            Fecha de retiro:
            <input
              type="date"
              value={fechaRetiro}
              onChange={(e) => setFechaRetiro(e.target.value)}
              required
            />
          </label>

          <label>
            Fecha de entrega:
            <input type="date" value={fechaEntrega} readOnly />
          </label>

          <div className="modal-buttons">
            <button type="submit">📥 Confirmar Préstamo</button>
            <button type="button" onClick={onClose}>
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPrestamo;
