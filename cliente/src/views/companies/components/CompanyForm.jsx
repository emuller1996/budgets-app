/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { postCreateCompanyService } from '../../../services/company.services'

export default function CompanyForm({ onHide, getAllCompanies }) {
  CompanyForm.propTypes = {
    onHide: PropTypes.func,
    getAllCompanies: PropTypes.func,
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    data.amount = parseFloat(data.amount)
    console.log(data)
    try {
      const res = await postCreateCompanyService(data)
      console.log(res.data)
      toast.success(res.data.message)
      onHide()
      getAllCompanies()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="name_company">
            <Form.Label>Name</Form.Label>
            <Form.Control
              {...register('name_company', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Industry</Form.Label>
            <Form.Control
              {...register('industry', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="code_company">
            <Form.Label>Code Company</Form.Label>
            <Form.Control
              {...register('code_company', { required: true })}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control {...register('address')} type="text" placeholder="" />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control {...register('phone')} type="text" placeholder="" />
          </Form.Group>
        </div>

       {/*  <div className="col-md-6">
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
        </div> */}
      </div>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description company</Form.Label>
        <Form.Control {...register('description')} as="textarea" rows={3} />
      </Form.Group>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button onClick={onHide} type="button" className="btn btn-danger text-white">
          CanceL
        </button>
        <Button className="text-white" type="submit" variant="success">
          Save Company
        </Button>
      </div>
    </form>
  )
}
