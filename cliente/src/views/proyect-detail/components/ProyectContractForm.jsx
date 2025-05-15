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
import { postCreateContractByProyect } from '../../../services/proyects.services'

export default function ProyectContractForm({ onHide, getAllBudgets }) {
  ProyectContractForm.propTypes = {
    onHide: PropTypes.func,
    getAllBudgets: PropTypes.func,
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm()

  const { getAllCompany, data } = useCompany()

  useEffect(() => {
    getAllCompany()
  }, [])

  const { id } = useParams()
  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount)
    console.log(data)
    try {
      const res = await postCreateContractByProyect(data, id)
      console.log(res.data)
      toast.success(res.data.message)
      onHide()
      getAllBudgets()
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
          <Form.Group className="mb-3" controlId="name_event">
            <Form.Label>Name Contract</Form.Label>
            <Form.Control
              {...register('name_contract', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
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
        <div className="col-md-6">
          {data && (
            <>
              <label className="form-label" htmlFor="company">
                company
              </label>
              <Controller
                name="company"
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
                      options={data.map((c) => {
                        return {
                          label: c.name_company,
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
      </div>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description Contract</Form.Label>
        <Form.Control {...register('description')} as="textarea" rows={3} />
      </Form.Group>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button onClick={onHide} type="button" className="btn btn-danger text-white">
          CanceL
        </button>
        <Button className="text-white" type="submit" variant="success">
          Save Proyect
        </Button>
      </div>
    </form>
  )
}
