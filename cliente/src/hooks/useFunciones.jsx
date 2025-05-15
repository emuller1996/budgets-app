/* eslint-disable prettier/prettier */

import { useState } from 'react'
import { getAllFuncionService, getBoletosByFuncionByidService, getFuncionByidService, getOrdenesByFuncionByidService } from '../services/funciones.services'

export const useFunciones = () => {
  const [data, setData] = useState([])
  const [dataDetalle, setDataDetalle] = useState([])
  const [dataBoletos, setDataBoletos] = useState(null)
  const [dataOrdenes, setDataOrdenes] = useState(null)




  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)



  const getAllFunciones = async (id) => {
    try {
      setLoading(true)
      const r = await getAllFuncionService()
      console.log(r.data)
      setData(r.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error.message)
    }
  }

  const getFuncionById = async (id) => {
    try {
      setLoading(true)
      const r = await getFuncionByidService(id)
      console.log(r.data)
      setDataDetalle(r.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error.message)
    }
  }

  const getBoletosByFuncionById = async (id) => {
    try {
      setLoading(true)
      const r = await getBoletosByFuncionByidService(id)
      console.log(r.data)
      setDataBoletos(r.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error.message)
    }
  }

  const getOrdenesByFuncionById = async (id) => {
    try {
      setLoading(true)
      const r = await getOrdenesByFuncionByidService(id)
      console.log(r.data)
      setDataOrdenes(r.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(error.message)
    }
  }




  

  return {
    data,
    error,
    loading,
    getAllFunciones,
    dataDetalle,
    getFuncionById,
    getBoletosByFuncionById,
    dataBoletos,
    getOrdenesByFuncionById,
    dataOrdenes
  }
}
