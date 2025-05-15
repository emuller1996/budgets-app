/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import DataTable from 'react-data-table-component'
import CurrencyInput from 'react-currency-input-field'
import { postCreateProyectByBudgetService } from '../../../services/budget.services'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { useCompany } from '../../../hooks/useCompany'
import { postCreateContractByProyect, postCreateInvoicesContractByProyect } from '../../../services/proyects.services'
import { useProyect } from '../../../hooks/useProyect'

export default function InvoiceContractForm({ onHide, getAllInvoices }) {
  InvoiceContractForm.propTypes = {
    onHide: PropTypes.func,
    getAllInvoices: PropTypes.func,
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm()
  const { id } = useParams()

  const { getContractProyectsById, Contracts } = useProyect()

  useEffect(() => {
    getContractProyectsById(id)
  }, [id])

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount)
    console.log(data)
    try {
      const res = await postCreateInvoicesContractByProyect(data, id)
      console.log(res.data)
      toast.success(res.data.message)
      onHide()
      getAllInvoices()
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 404) {
        toast.error(`${error?.response?.data.message}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="row">
        <div className="col-md-6">
          {Contracts && (
            <>
              <label className="form-label" htmlFor="contract_id">
                Contract
              </label>
              <Controller
                name="contract_id"
                rules={{ required: true }}
                control={control}
                render={({ field: { name, onChange, ref } }) => {
                  return (
                    <Select
                      ref={ref}
                      id={name}
                      name={name}
                      placeholder=""
                      onChange={(e) => {
                        console.log(e)
                        onChange(e?.value)
                      }}
                      options={Contracts.map((c) => {
                        return {
                          label: c.name_contract,
                          value: c._id,
                        }
                      })}
                    />
                  )
                }}
              />
            </>
          )}
        </div>
        <div className="col-md-6">
          <div>
            <Form.Label>Value (amount)</Form.Label>
            <Controller
              control={control}
              name="amount"
              //defaultValue={producto?.price}
              rules={{ required: true }}
              render={({ field: { name, onChange, ref, value } }) => {
                return (
                  <CurrencyInput
                    ref={ref}
                    className="form-control"
                    id={name}
                    name={name}
                    value={value}
                    placeholder=""
                    decimalsLimit={2}
                    prefix="$"
                    intlConfig={{ locale: 'en-US', currency: 'USD' }}
                    onValueChange={(value, name, values) => {
                      console.log(value, name, values)
                      onChange(value)
                    }}
                  />
                )
              }}
            />
          </div>
        </div>
      </div>
      <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description Contract</Form.Label>
        <Form.Control {...register('description')} as="textarea" rows={3} />
      </Form.Group>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button onClick={onHide} type="button" className="btn btn-danger text-white">
          CanceL
        </button>
        <Button className="text-white" type="submit" variant="success">
          Save Invoice
        </Button>
      </div>
    </form>
  )
}
