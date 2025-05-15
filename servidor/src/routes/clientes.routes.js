import { Router } from "express";
import xlsx from "xlsx";
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
import pkg from "express-fileupload";
import { client } from "../db.js";
import { buscarElasticByType, crearElasticByType, getDocumentById, updateElasticByType } from "../utils/index.js";

const fileUpload = pkg;
const ClienteRouters = Router();
const INDEX_ES ="eventosmull"


ClienteRouters.get("/", async (req, res) => {
  try {

    var clientes = await buscarElasticByType('cliente');
    clientes = clientes.map( async c => {
      if(c.ruta_id && c.ruta_id !=="" ){
        try {          
          const re =await getDocumentById(c.ruta_id);
          console.log(re.body);
          return {
            ...c,
            ruta_view: { ... re.body._source, 
              _id:re.body._id
            }
          }
        } catch (error) {
          return c
        }
      }else{
        return c

      }
    })
    clientes =  await Promise.all(clientes);
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.get("/:id", async (req, res) => {
  try {

    var cliente = await getDocumentById(req.params.id);
   
    
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


ClienteRouters.post("/", async (req, res) => {
  try {
    var customer = {};
    const data = req.body;
    data.createdTime = new Date().getTime();
    data.deuda_actual = 0;

    const response = await crearElasticByType( data,"cliente")
    customer = response.body;
    return res.status(200).json({ message: "Customer Created", customer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.put("/:id", async (req, res) => {
  try {
    const r =await updateElasticByType(req.params.id,req.body)
    if(r.body.result ==="updated"){
      await client.indices.refresh({ index: INDEX_ES });
      return res.json({message:"Cliente Actualizado"})
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

export default ClienteRouters;
