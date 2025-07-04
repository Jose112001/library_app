import Lottie from "lottie-react";
import animacionCarga from "../assets/lotties/loading_lottie.json";
const Lotties = () => {
  const estiloLoading = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontSize: "1.3rem",
    textAlign: "center",
  };
  return (
    <div style={estiloLoading}>
      <Lottie
        animationData={animacionCarga}
        loop={true}
        style={{ height: 200 }}
      ></Lottie>
      <p>📚 Cargando biblioteca...</p>
    </div>
  );
};

export default Lotties;
