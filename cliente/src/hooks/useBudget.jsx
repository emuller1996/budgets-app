/* eslint-disable prettier/prettier */

import { useState } from 'react'
import {
  getAllBudgetByIdService,
  getAllBudgetsService,
  getProyectByBudgetService,
} from '../services/budget.services'

export const useBudget = () => {
  const [data, setData] = useState([])
  const [dataDetalle, setDataDetalle] = useState(null)
  const [Proyects, setProyects] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllBudgets = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getAllBudgetsService()
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      console.log(res)

      if (!signal.aborted) {
        setData(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setData(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  const getBudgetById = async (id) => {
    try {
      const r = await getAllBudgetByIdService(id)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProyectsBudgetById = async (id) => {
    try {
      const r = await getProyectByBudgetService(id)
      console.log(r.data)
      setProyects(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    data,
    error,
    loading,
    getAllBudgets,
    getBudgetById,
    dataDetalle,
    getProyectsBudgetById,
    Proyects,
  }
}
