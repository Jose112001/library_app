import Lottie from "lottie-react";
import animacionCarga from "../assets/lotties/loading_lottie.json";
const Lotties = ({ fullScreen = true, mensaje = "📚 Cargando..." }) => {
  const estilo = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: fullScreen ? "100vh" : "auto",
    fontSize: "1.3rem",
    textAlign: "center",
  };

  return (
    <div style={estilo}>
      <Lottie animationData={animacionCarga} loop={true} style={{ height: 200 }} />
      <p>{mensaje}</p>
    </div>
  );
};

export default Lotties;
