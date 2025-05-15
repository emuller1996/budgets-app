import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  createInMasaDocumentByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import { client } from "../db.js";
const INDEX_ES = "eventosmull";

const FuncionesRouters = Router();

FuncionesRouters.get("/", async (req, res) => {
  try {
    var funciones = await buscarElasticByType("funcion");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(funciones);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

FuncionesRouters.get("/:id", async (req, res) => {
  try {
    var funcion = await getDocumentById(req.params.id);

    if(funcion.evento_id){
      funcion.evento = await getDocumentById(funcion.evento_id);
    }
    if(funcion.evento.esquema_id){
      funcion.esquema = await getDocumentById(funcion.evento.esquema_id);
    }
    if(funcion.evento.recinto_id){
      funcion.recinto = await getDocumentById(funcion.evento.recinto_id);
    }
    return res.status(200).json(funcion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

FuncionesRouters.post("/get/:id/boletos/", async (req, res) => {
  try {
    let section = req.body.section;

    const searchResult = await client.search({
      index: INDEX_ES,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "boleto",
                  },
                },
              },
              {
                term: {
                  "section.keyword": {
                    value: section,
                  },
                },
              },
              {
                term: {
                  "status.keyword": {
                    value: "Disponible",
                  },
                },
              },
              {
                term: {
                  "function_id.keyword": {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        sort: [
          { order_num_ticket: { order: "asc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });

    const dataBoletos = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });
    let boletoAdd = dataBoletos[0];
    if (boletoAdd) {
      await updateElasticByType(boletoAdd._id, { status: "En Venta" });
      return res.json({ message: "Boleto En Venta", boleto: boletoAdd });
    } else {
      return res.status(400).json({ message: `No hay boletos disponibles en la seccion ${section}.` });
    }
  } catch (error) {}
});

FuncionesRouters.get("/:id/boletos", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "boleto",
                  },
                },
              },
              {
                term: {
                  "function_id.keyword": {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "asc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
        aggs: {
          estados: {
            terms: {
              field: "status.keyword",
              size: 10,
            },
          },
        },
      },
    });

    let estatus = searchResult.body.aggregations

    const dataBoletos = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });

    return res.status(200).json({boletos :dataBoletos, estado:estatus.estados.buckets});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

FuncionesRouters.get("/:id/ordenes", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "orden",
                  },
                },
              },
              {
                term: {
                  "funcion_id.keyword": {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });


    var dataBoletos = searchResult.body.hits.hits.map( async(c) => {
      return {
        ...c._source,
        _id: c._id,
        evento : await getDocumentById(c._source.evento_id),
        funcion : await getDocumentById(c._source.funcion_id)
      };
    });
    dataBoletos = await Promise.all(dataBoletos)

    return res.status(200).json(dataBoletos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default FuncionesRouters;
