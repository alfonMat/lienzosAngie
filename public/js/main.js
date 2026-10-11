import { CuadroModel } from "../../models/cuadroModel.js";
import { CuadroController } from "../../controllers/cuadroController.js";
import { CuadroView } from "./cuadroView.js";

const controlador = new CuadroController(new CuadroModel(), new CuadroView());

controlador.iniciar().catch((error) => {
  console.error("No se pudo iniciar la página de Lienzo Angie.", error);
  new CuadroView().mostrarError(
    "No se pudo cargar la página. Comprueba la conexión y vuelve a intentarlo.",
  );
});
