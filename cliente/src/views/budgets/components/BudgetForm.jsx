/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import DataTable from 'react-data-table-component'
import CurrencyInput from 'react-currency-input-field'
import { postCreateBudgetService } from '../../../services/budget.services'

export default function BudgetForm({ onHide, getAllBudgets }) {
  BudgetForm.propTypes = {
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

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount)
    console.log(data)
    try {
      const res = await postCreateBudgetService(data)
      console.log(res.data)
      toast.success(res.data.message)
      onHide()
      getAllBudgets()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="name_event">
            <Form.Label>Name Budget</Form.Label>
            <Form.Control
              {...register('name_budget', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              {...register('category', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="start_date">
            <Form.Label>Date Start</Form.Label>
            <Form.Control {...register('start_date', { required: true })} type="date" />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="end_date">
            <Form.Label>Date End</Form.Label>
            <Form.Control {...register('end_date', { required: true })} type="date" />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <div>
            <Form.Label>VAlur (amount)</Form.Label>
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
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Descripcion del Evento</Form.Label>
        <Form.Control {...register('description')} as="textarea" rows={3} />
      </Form.Group>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button onClick={onHide} type="button" className="btn btn-danger text-white">
          CanceL
        </button>
        <Button className="text-white" type="submit" variant="success">
          Save Budget
        </Button>
      </div>
    </form>
  )
}
