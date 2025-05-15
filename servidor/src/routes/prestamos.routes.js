import { Router } from "express";
import xlsx from "xlsx";
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
import { client } from "../db.js";
import {
  buscarElasticByType,
  crearElasticByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";

const PrestamoRouters = Router();
const INDEX_ES = "eventosmull";

PrestamoRouters.get("/", async (req, res) => {
  try {
    var clientes = await buscarElasticByType("prestamo");
    console.log(clientes);

    clientes = clientes.map(async (c) => {
      if (c.clienteId && c.clienteId !== "") {
        try {
          console.log(c.clienteId);
          const re = await getDocumentById(c.clienteId);
          console.log(re);
          return {
            ...c,
            cliente: { ...re },
          };
        } catch (error) {
          return c;
        }
      } else {
        return c;
      }
    });
    clientes = await Promise.all(clientes);
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamoRouters.get("/:id", async (req, res) => {
  try {
    var cliente = await getDocumentById(req.params.id);
    cliente.cliente =  await getDocumentById(cliente.clienteId)
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamoRouters.post("/", async (req, res) => {
  try {
    var customer = {};
    const data = req.body;
    data.createdTime = new Date().getTime();
    data.interes_porcentaje = 0.2;
    data.pago_interes = data.valor_prestamo * 0.2;
    data.valor_pagado = 0;
    data.valor_pagado = "Pendiente";
    data.deuda_actual = data.pago_interes + data.valor_prestamo;

    let cliente = await getDocumentById(data.clienteId);
    console.log(cliente);
    if (cliente.deuda_actual) {
      cliente.deuda_actual += data.deuda_actual;
    } else {
      cliente.deuda_actual = data.deuda_actual;
    }

    const response = await crearElasticByType(data, "prestamo");
    await updateElasticByType(cliente._id, {
      deuda_actual: cliente.deuda_actual,
    });
    customer = response.body;
    return res.status(200).json({ message: "Customer Created", customer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamoRouters.post("/:id/pagos", async (req, res) => {
  try {
    var customer = {};
    const data = req.body;
    data.createdTime = new Date().getTime();
    data.prestamo_id = req.params.id

    console.log(data);
    
    const response = await crearElasticByType(data, "pago");
    customer = response.body;
    let prestamodata = await getDocumentById(req.params.id);
    prestamodata.deuda_actual -= data.valor_pagado;
    await updateElasticByType(prestamodata._id, {
      deuda_actual: prestamodata.deuda_actual,
    });
    return res.status(200).json({ message: "Customer Created", customer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamoRouters.put("/:id", async (req, res) => {
  try {
    const r = await updateElasticByType(req.params.id, req.body);
    if (r.body.result === "updated") {
      await client.indices.refresh({ index: INDEX_ES });
      return res.json({ message: "Cliente Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default PrestamoRouters;
