/* eslint-disable prettier/prettier */

import { useState } from 'react'

import { getAllCompanyService, getCompanyByIdService } from '../services/company.services'

export const useCompany = () => {
  const [data, setData] = useState([])
  const [dataDetalle, setDataDetalle] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getAllCompany = async () => {
    setLoading(true)
    setData([])
    try {
      const res = await getAllCompanyService()
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

  const getCompanyById = async (id) => {
      try {
        const r = await getCompanyByIdService(id)
        console.log(r.data)
        setDataDetalle(r.data)
      } catch (error) {
        console.log(error)
      }
    }


  return {
    data,
    error,
    loading,
    getAllCompany,
    getCompanyById,
    dataDetalle
  }
}
