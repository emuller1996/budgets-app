import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  createInMasaDocumentByType,
  getDocumentById,
} from "../utils/index.js";
import { client } from "../db.js";
const INDEX_ES = "eventosmull";

const EventosRouters = Router();

EventosRouters.get("/", async (req, res) => {
  try {
    var eventos = await buscarElasticByType("evento");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(eventos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

EventosRouters.get("/:id", async (req, res) => {
  try {
    var evento = await getDocumentById(req.params.id);
    evento.recinto = await getDocumentById(evento.recinto_id);
    evento.esquema = await getDocumentById(evento.esquema_id);
    return res.status(200).json(evento);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

EventosRouters.get("/:id/funciones", async (req, res) => {
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
                    value: "funcion",
                  },
                },
              },
              {
                term: {
                  "evento_id.keyword": {
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
      },
    });

    const dataFuncion = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });

    return res.status(200).json(dataFuncion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

EventosRouters.post("/", async (req, res) => {
  try {
    const dataEventRe = req.body;
    const EventoCreate = {
      name: dataEventRe.name_event,
      category: dataEventRe.category,
      start_date: dataEventRe.start_date,
      end_date: dataEventRe.end_date,
      description: dataEventRe.description,
      recinto_id: dataEventRe.recinto_id,
      esquema_id: dataEventRe.esquema_id,
      sections_price: dataEventRe.sections_price,
    };

    const resElas = await crearElasticByType(EventoCreate, "evento");

    const FuncionCreate = {
      name: dataEventRe.name_function,
      start_date: dataEventRe.start_date_function,
      end_date: dataEventRe.end_date_function,
      description: dataEventRe.description_function,
      evento_id: resElas.body._id,
      image: dataEventRe.image,
    };

    const resElasCreateFun = await crearElasticByType(FuncionCreate, "funcion");

    const esquemaData = await getDocumentById(dataEventRe.esquema_id);
    let sections = esquemaData.sections;
    let tickesPie = [];
    sections.forEach((sect) => {
      for (let index = 1; index <= sect.aforo; index++) {
        tickesPie.push({
          num_ticket: `${sect.letra} - ${index}`,
          section: `${sect.name_section}`,
          status: `Disponible`,
          status_ticket: `Disponible`,
          function_id: resElasCreateFun.body._id,
          order_num_ticket: parseInt(index),
        });
      }
    });
    var r = await createInMasaDocumentByType(tickesPie, "boleto");
    return res.status(200).json({
      message: "Se creo el evento, funcion y boletos correctamente. ",
      evento_id: resElas._id,
      tickesPie,
      boletos: r,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

EventosRouters.post("/:id/funcion", async (req, res) => {
  
  const dataEventRe = req.body;
  const FuncionCreate = {
    name: dataEventRe.name_function,
    start_date: dataEventRe.start_date_function,
    end_date: dataEventRe.end_date_function,
    description: dataEventRe.description_function,
    evento_id: req.params.id,
    image: dataEventRe.image,
  };

  const resElasCreateFun = await crearElasticByType(FuncionCreate, "funcion");

  const eventData = await getDocumentById(req.params.id);
  const esquemaData = await getDocumentById(eventData.esquema_id);
    let sections = esquemaData.sections;
    let tickesPie = [];
    sections.forEach((sect) => {
      for (let index = 1; index <= sect.aforo; index++) {
        tickesPie.push({
          num_ticket: `${sect.letra} - ${index}`,
          section: `${sect.name_section}`,
          status: `Disponible`,
          status_ticket: `Disponible`,
          function_id: resElasCreateFun.body._id,
          order_num_ticket: parseInt(index),
        });
      }
    });
    var r = await createInMasaDocumentByType(tickesPie, "boleto");
    return res.status(200).json({
      message: "Se creo la funcion y boletos correctamente. ",
      //evento_id: resElas._id,
      tickesPie,
      boletos: r,
    });

})

export default EventosRouters;
