import { Router } from "express";
import { client } from "../db.js";
import ClienteRouters from "./clientes.routes.js";
import RecintosRouters from "./recintos.routes.js";
import EventosRouters from "./eventos.routes.js";
import FuncionesRouters from "./funciones.routes.js";
import BoletoRouters from "./boletos.routes.js";
import OrdenesRouters from "./ordenes.routes.js";
import PuntoVentaRouters from "./punto_venta.routes.js";
import UsuariosRouters from "./usuarios.routes.js";
import AuthRouters from "./auth.routes.js";
import DashboardRouters from "./dashboard.routes.js";
import { crearElasticByType } from "../utils/index.js";
import PrestamoRouters from "./prestamos.routes.js";
import PagosRouters from "./pagos.routes.js";
import BudgetsRouters from "./budgets.routes.js";

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/clientes", ClienteRouters);
router.use("/prestamos", PrestamoRouters);
router.use("/pagos", PagosRouters);

router.use("/proyects", RecintosRouters);
router.use("/eventos", EventosRouters);
router.use("/budgets", BudgetsRouters);

router.use("/funcion", FuncionesRouters);
router.use("/boleto", BoletoRouters);
router.use("/ordenes", OrdenesRouters);
router.use("/company", PuntoVentaRouters);
router.use("/usuarios", UsuariosRouters);
router.use("/auth", AuthRouters);
router.use("/dash", DashboardRouters);

router.get("/test", async (req, res) => {
  try {
    /* const searchResult = await client.get({index:"test"}) */

    return res.json({ message: "ss", client /* searchResult */ });
  } catch (error) {
    return res.json({ message: "ss", error: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const searchResult = client;
    console.log(client);
    return res.json(client);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});

export default router;
