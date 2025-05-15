/* eslint-disable prettier/prettier */

import axios from "axios";

export const postCreateBudgetService = (data) => {
  return axios.post("/budgets", data);
};

export const getAllBudgetsService = (data) => {
  return axios.get("/budgets", data);
};

export const getAllBudgetByIdService = (id) => {
  return axios.get(`/budgets/${id}/`);
};
export const postCreateProyectByBudgetService = (data,id) => {
  return axios.post(`/budgets/${id}/proyect`, data);
};

export const getProyectByBudgetService = (id) => {
  return axios.get(`/budgets/${id}/proyect`);
};






