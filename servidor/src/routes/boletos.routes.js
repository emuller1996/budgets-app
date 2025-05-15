
import { Router } from "express";

import { buscarElasticByType, crearElasticByType, getDocumentById, updateElasticByType } from "../utils/index.js";
const INDEX_ES = "eventosmull";


const BoletoRouters = Router();

BoletoRouters.post("/:id/disponible", async (req, res) => {
    try {
      const r =await updateElasticByType(req.params.id,{status:"Disponible"})
      return res.json({r , message:"Boleto Disponible"})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })

export default BoletoRouters;
