/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreateBudgetService = (data) => {
  return axios.post("/proyects", data);
};

export const getAllProyectsService = (data) => {
  return axios.get("/proyects", data);
};

export const getProyectByIdService = (id) => {
  return axios.get(`/proyects/${id}/`);
};
export const getContractByProyectService = (id) => {
  return axios.get(`/proyects/${id}/contract`);
};
export const postCreateContractByProyect = (data,id) => {
  return axios.post(`/proyects/${id}/contract`, data);
};

export const postCreateInvoicesContractByProyect = (data,id) => {
  return axios.post(`/proyects/${id}/invoices`, data);
};

export const getInvoicesContractByProyectService = (id) => {
  return axios.get(`/proyects/${id}/invoices`);
};
/* export const postCreateProyectByBudgetService = (data,id) => {
  return axios.post(`/budgets/${id}/proyect`, data);
};

export const getProyectByBudgetService = (id) => {
  return axios.get(`/budgets/${id}/proyect`);
}; */






