import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  createInMasaDocumentByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import { client } from "../db.js";
import { INDEX_ES_MAIN } from "../config.js";

const BudgetsRouters = Router();

BudgetsRouters.get("/", async (req, res) => {
  try {
    var eventos = await buscarElasticByType("budget");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(eventos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
BudgetsRouters.get("/:id", async (req, res) => {
  try {
    var evento = await getDocumentById(req.params.id);
    return res.status(200).json(evento);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

BudgetsRouters.post("/", async (req, res) => {
  try {
    const dataBudget = req.body;
    dataBudget.available_amount = dataBudget.amount;
    dataBudget.assigned_amount = 0;
    dataBudget.used_amount = 0;

    const resElas = await crearElasticByType(dataBudget, "budget");
    return res.status(200).json({
      message: "Budget Created ",
      resElas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

function ViewDollar(strt) {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return USDollar.format(strt);
}
BudgetsRouters.post("/:id/proyect", async (req, res) => {
  try {
    const dataProyectBudget = req.body;
    dataProyectBudget.available_amount = dataProyectBudget.amount;
    dataProyectBudget.assigned_amount = 0;
    dataProyectBudget.used_amount = 0;
    dataProyectBudget.budget_id = req.params.id;
    //validaciones

    const budgetMain = await getDocumentById(req.params.id);

    if (budgetMain.available_amount < dataProyectBudget.amount) {
      return res.status(404).json({
        message: `Error: Monto del proyecto Superior al monto disponible en el presupuesto. (Monto Disponible en el Presuento ${ViewDollar(
          budgetMain.available_amount
        )})`,
        detail: `Error: Monto del proyecto Superior al monto disponible en el presupuesto.`,
      });
    }

    budgetMain.assigned_amount += dataProyectBudget.amount;
    budgetMain.available_amount -= dataProyectBudget.amount;
    delete budgetMain._id;
    await updateElasticByType(req.params.id, budgetMain);
    await crearElasticByType(dataProyectBudget, "project");
    return res.status(200).json({
      message: "Proyect Created ",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

BudgetsRouters.get("/:id/proyect", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 10000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "project",
                  },
                },
              },
              {
                term: {
                  "budget_id.keyword": {
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

export default BudgetsRouters;
