/* eslint-disable prettier/prettier */

import { useState } from 'react'

import {
  getAllProyectsService,
  getContractByProyectService,
  getInvoicesContractByProyectService,
  getProyectByIdService,
} from '../services/proyects.services'

export const useProyect = () => {
  const [data, setData] = useState([])
  const [dataDetalle, setDataDetalle] = useState(null)
  const [Contracts, setContracts] = useState(null)
  const [Invoices, setInvoices] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllProyects = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getAllProyectsService()
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

  const getProyectById = async (id) => {
    try {
      const r = await getProyectByIdService(id)
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getContractProyectsById = async (id) => {
    try {
      const r = await getContractByProyectService(id)
      console.log(r.data)
      setContracts(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getInvoiceContractProyectsById = async (id) => {
    try {
      const r = await getInvoicesContractByProyectService(id)
      console.log(r.data)
      setInvoices(r.data)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    data,
    error,
    loading,
    getAllProyects,
    getProyectById,
    dataDetalle,
    getContractProyectsById,
    getInvoiceContractProyectsById,
    Contracts,
    Invoices
  }
}
