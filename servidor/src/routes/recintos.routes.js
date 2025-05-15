import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import { client } from "../db.js";
import { INDEX_ES_MAIN } from "../config.js";

const RecintosRouters = Router();

RecintosRouters.get("/", async (req, res) => {
  try {
    var Recintos = await buscarElasticByType("project");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(Recintos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

RecintosRouters.get("/:id", async (req, res) => {
  try {
    var evento = await getDocumentById(req.params.id);
    return res.status(200).json(evento);
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

RecintosRouters.post("/:id/contract", async (req, res) => {
  try {
    const dataContracProyect = req.body;
    dataContracProyect.available_amount = dataContracProyect.amount;
    dataContracProyect.assigned_amount = 0;
    dataContracProyect.used_amount = 0;
    dataContracProyect.proyect_id = req.params.id;
    //validaciones

    const ProyectMain = await getDocumentById(req.params.id);

    if (ProyectMain.available_amount < dataContracProyect.amount) {
      return res.status(404).json({
        message: `Error: Monto del contracto es superior al monto disponible en el proyecto. (Monto Disponible en el proyecto ${ViewDollar(
          ProyectMain.available_amount
        )})`,
        detail: `Error: Monto del proyecto Superior al monto disponible en el presupuesto.`,
      });
    }

    ProyectMain.assigned_amount += dataContracProyect.amount;
    ProyectMain.available_amount -= dataContracProyect.amount;
    delete ProyectMain._id;
    await updateElasticByType(req.params.id, ProyectMain);
    await crearElasticByType(dataContracProyect, "contract");
    return res.status(200).json({
      message: "Contrac Created ",
      ProyectMain,
      dataContracProyect,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

RecintosRouters.get("/:id/contract", async (req, res) => {
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
                    value: "contract",
                  },
                },
              },
              {
                term: {
                  "proyect_id.keyword": {
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

    /* const dataFuncion = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    }); */

    var dataFuncion = searchResult.body.hits.hits.map(async (c) => {
      return {
        ...c._source,
        _id: c._id,
        company_object: await getDocumentById(c._source.company),
        //funcion: await getDocumentById(c._source.funcion_id),
      };
    });
    dataFuncion = await Promise.all(dataFuncion);

    return res.status(200).json(dataFuncion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

RecintosRouters.get("/:id/invoices", async (req, res) => {
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
                    value: "invoice",
                  },
                },
              },
              {
                term: {
                  "proyect_id.keyword": {
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

    /* const dataFuncion = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    }); */
    var dataFuncion = searchResult.body.hits.hits.map(async (c) => {
      return {
        ...c._source,
        _id: c._id,
        contract_object: await getDocumentById(c._source.contract_id),
        //funcion: await getDocumentById(c._source.funcion_id),
      };
    });
    dataFuncion = await Promise.all(dataFuncion);

    return res.status(200).json(dataFuncion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

RecintosRouters.post("/:id/invoices", async (req, res) => {
  try {
    const dataInvoicesContracProyect = req.body;
    //dataInvoicesContracProyect.available_amount = dataInvoicesContracProyect.amount;
    //dataInvoicesContracProyect.assigned_amount = 0;
    //dataInvoicesContracProyect.used_amount = 0;
    dataInvoicesContracProyect.proyect_id = req.params.id;
    //validaciones

    const ContractMain = await getDocumentById(
      dataInvoicesContracProyect.contract_id
    );
    const ProyectMain = await getDocumentById(req.params.id);
    const BudgetMain = await getDocumentById(ProyectMain.budget_id);

    if (ContractMain.available_amount < dataInvoicesContracProyect.amount) {
      return res.status(404).json({
        message: `Error: Monto del contracto es superior al monto disponible en el proyecto. (Monto Disponible en el proyecto ${ViewDollar(
          ContractMain.available_amount
        )})`,
        detail: `Error: Monto del proyecto Superior al monto disponible en el presupuesto.`,
      });
    }

    ContractMain.assigned_amount += dataInvoicesContracProyect.amount;
    ContractMain.used_amount += dataInvoicesContracProyect.amount;
    ContractMain.available_amount -= dataInvoicesContracProyect.amount;

    //ProyectMain.assigned_amount += dataInvoicesContracProyect.amount;
    ProyectMain.used_amount += dataInvoicesContracProyect.amount;
    BudgetMain.used_amount += dataInvoicesContracProyect.amount;

    //ProyectMain.available_amount -= dataInvoicesContracProyect.amount;
    delete ContractMain._id;
    delete ProyectMain._id;
    delete BudgetMain._id;

    await updateElasticByType(
      dataInvoicesContracProyect.contract_id,
      ContractMain
    );
    await updateElasticByType(req.params.id, ProyectMain);
    await updateElasticByType(ProyectMain.budget_id, BudgetMain);
    await crearElasticByType(dataInvoicesContracProyect, "invoice");
    return res.status(200).json({
      message: "Contrac Created ",
      ContractMain,
      ProyectMain,
      dataInvoicesContracProyect,
      BudgetMain,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default RecintosRouters;
