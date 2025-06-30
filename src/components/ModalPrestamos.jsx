import React, { useState } from "react";
import { supabase } from "../services/supabase";
import "./ModalPrestamo.css"; // Importamos los estilos CSS

const ModalPrestamo = ({ libro, usuario, onClose, onSuccess }) => {
  const [mensaje, setMensaje] = useState("");

  const registrarPrestamo = async () => {
    if (!libro || !usuario) return;

    const { data: prestamosActivos, error: errorCount } = await supabase
      .from("prestamos")
      .select("*", { count: "exact" })
      .eq("id_usuario", usuario.id)
      .is("fecha_devolucion", null);

    if (errorCount) {
      setMensaje("⚠️ Error al validar préstamos.");
      return;
    }

    if ((prestamosActivos?.length || 0) >= 3) {
      setMensaje("❌ No puedes tener más de 3 libros prestados.");
      return;
    }

    if (libro.cantidad_disponible <= 0) {
      setMensaje("❌ No hay ejemplares disponibles.");
      return;
    }

    const { error: errorInsert } = await supabase.from("prestamos").insert([
      {
        id_libro: libro.id,
        id_usuario: usuario.id,
        fecha_prestamo: new Date().toISOString().split("T")[0],
      },
    ]);

    if (errorInsert) {
      setMensaje("❌ Error al registrar préstamo.");
    } else {
      setMensaje("✅ Préstamo registrado correctamente.");
      onSuccess();
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>📖 Solicitar préstamo</h2>
        <p>
          ¿Deseas solicitar el libro <strong>{libro.titulo}</strong>?
        </p>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <div className="modal-buttons">
          <button onClick={registrarPrestamo} className="btn btn-confirmar">
            Confirmar
          </button>
          <button onClick={onClose} className="btn btn-cancelar">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPrestamo;
