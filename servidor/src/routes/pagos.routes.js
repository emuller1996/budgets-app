import { Router } from "express";
import xlsx from "xlsx";
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
import pkg from "express-fileupload";
import { client } from "../db.js";
import { buscarElasticByType, crearElasticByType, getDocumentById, updateElasticByType } from "../utils/index.js";

const fileUpload = pkg;
const PagosRouters = Router();
const INDEX_ES ="eventosmull"


PagosRouters.get("/", async (req, res) => {
  try {

    var pagos = await buscarElasticByType('pago');
    pagos = pagos.map( async c => {
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
    pagos =  await Promise.all(pagos);
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PagosRouters.get("/:id", async (req, res) => {
  try {

    var cliente = await getDocumentById(req.params.id);
   
    
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});





export default PagosRouters;
