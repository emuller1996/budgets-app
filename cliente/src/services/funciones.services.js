/* eslint-disable prettier/prettier */

import axios from 'axios'

export const getAllFuncionService = () => {
  return axios.get('/funcion')
}

export const getFuncionByidService = (id) => {
  return axios.get(`/funcion/${id}`)
}

export const getBoletosByFuncionByidService = (id) => {
  return axios.get(`/funcion/${id}/boletos`)
}

export const getOrdenesByFuncionByidService = (id) => {
  return axios.get(`/funcion/${id}/ordenes`)
}


export const getBoletoBySeccionByidService = (id,data) => {
  return axios.post(`/funcion/get/${id}/boletos`,data)
}
