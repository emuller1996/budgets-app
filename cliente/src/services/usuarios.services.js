/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreateUsuariosService = (data) => {
  return axios.post("/usuarios", data);
};


export const getAllUsuariosService = (data) => {
  return axios.get("/usuarios", data);
};



