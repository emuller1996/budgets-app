/* eslint-disable prettier/prettier */

import { useState } from 'react'
import { getSales30DaysService } from '../services/dashboard.services'

export const useDashboard = () => {
  const [dataDetalle, setDataDetalle] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal

  const getSales30Days = async () => {
    try {
      setLoading(true)

      const r = await getSales30DaysService()
      console.log(r.data)
      setDataDetalle(r.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    getSales30Days,
    dataDetalle,
  }
}
