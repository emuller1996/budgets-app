/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreateCompanyService = (data) => {
  return axios.post("/company", data);
};

export const getAllCompanyService = (data) => {
  return axios.get("/company", data);
};

export const getCompanyByIdService = (id) => {
  return axios.get(`/company/${id}/`);
};








