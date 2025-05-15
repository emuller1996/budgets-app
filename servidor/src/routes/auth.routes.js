import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";


import {
  buscarElasticByType,
  crearElasticByType,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import { client } from "../db.js";
import md5 from "md5";
import { validateToken } from "../utils/authjws.js";
const INDEX_ES = "eventosmull";

const AuthRouters = Router();

AuthRouters.get("/validate", validateToken)
AuthRouters.post("/login", async (req, res) => {
  console.log(req.body);

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
                  value: "usuario",
                },
              },
            },
            {
              term: {
                "email.keyword": {
                  value: req.body.email,
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


  if(dataFuncion.length === 0){
    return res.status(400).json({ message: "Usuario no registrado."});
  }

  let passtest = md5(req.body.password)
  if(passtest !== dataFuncion[0].password){
    return res.status(400).json({ message: "Contraseña incorrecta." });
  }

  let userData = dataFuncion[0];
  delete userData.password
  let token = generateAccessToken(userData)
  return res.json({ message: "TEst", dataFuncion, passtest, token });
});

const generateAccessToken = (user) => {
  return jsonwebtoken.sign(user, "EVENTOMULL", { expiresIn: "60m" });
};

export default AuthRouters;
