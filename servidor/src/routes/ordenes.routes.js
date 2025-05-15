import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  createInMasaDocumentByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import axios from "axios";
import { client } from "../db.js";
const INDEX_ES = "eventosmull";
const OrdenesRouters = Router();

OrdenesRouters.post("/", async (req, res) => {
  try {
    var order = {};
    const data = req.body;
    data.createdTime = new Date().getTime();

    const response = await crearElasticByType(data, "orden");
    order = response.body;

    const rrPromesas = data.boletos.map(async (bol) => {
      const r = await updateElasticByType(bol._id, { status: "Vendido" });
      return r;
    });
    await Promise.all(rrPromesas);
    return res.status(201).json({ message: "Orden Generada.", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

OrdenesRouters.post("/process_payment", async (req, res) => {
  let data = req.body;
  let ordenData = req.body.ordenData;

  delete data.ordenData;
  console.log(req.body);
  console.log(data);
  console.log(ordenData);
  try {
    const t = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      data,
      {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      }
    );
    console.log(t.data);
    ordenData.mercadopago_id = t.data.id;
    ordenData.payment_method = "Tarjeta";
    if (t.data.status === "approved") {
      const response = await crearElasticByType(ordenData, "orden");
      let order = response.body;
      const rrPromesas = ordenData.boletos.map(async (bol) => {
        const r = await updateElasticByType(bol._id, { status: "Vendido" });
        return r;
      });
      await Promise.all(rrPromesas);
      return res.json({ message: "Melo", order, mercaResponse: t.data });
    } else {
      return res.json({
        message: "ERROR EN EL PAGO CON TARJETA",
        mercaResponse: t.data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});
OrdenesRouters.get("/", async (req, res) => {
  try {
    var ordenes = await buscarElasticByType("orden");
    /* return res.json(searchResult.body.hits); */
    ordenes = ordenes.map(async (or) => {
      if (or.evento_id) {
        //await getDocumentById(or.evento_id)
        or.evento = await getDocumentById(or.evento_id);
      }
      /* if(or.funcion_id){
        //await getDocumentById(or.funcion_id)
        or.funcion =  await getDocumentById(or.funcion_id)
      } */
      if (or.mercadopago_id) {
        const r = await axios.get(
          `https://api.mercadopago.com/v1/payments/${or.mercadopago_id}`,
          {
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
          }
        );
        or.mercadopago_data = r.data;
      }
      return or;
    });

    ordenes = await Promise.all(ordenes);
    return res.status(200).json(ordenes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

OrdenesRouters.get("/:id", async (req, res) => {
  try {
    const data = await getDocumentById(req.params.id);
    if (data.mercadopago_id) {
      const r = await axios.get(
        `https://api.mercadopago.com/v1/payments/${data.mercadopago_id}`,
        {
          headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
        }
      );
      data.mercadopago_data = r.data;
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

export default OrdenesRouters;
