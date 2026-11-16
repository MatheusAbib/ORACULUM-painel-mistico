
import { ToastContainer } from "react-toastify";
import { Rodape } from "./compartilhado/componentes/Rodape";
import { ModalBoasVindas } from "./compartilhado/componentes/ModalBoasVindas";
import { PerfilProvedor } from "./nucleo/contextos/PerfilContexto";
import { Rotas } from "./rotas";
import "react-toastify/dist/ReactToastify.css";
import "./estilos/toast.scss";

export function App() {
  return (
    <PerfilProvedor>
      <main>
        <Rotas />
      </main>
      <Rodape />
      <ModalBoasVindas />
      <ToastContainer />
    </PerfilProvedor>
  );
}
