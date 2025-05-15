import React, { useEffect, useState } from 'react'
import { useFunciones } from '../../hooks/useFunciones'
import { usePuntoVenta } from '../../hooks/usePuntoVenta'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

const ContactanosPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
  }
  return (
    <div>
      <div className="container mt-4">
        <h4 className="text-center ">Contactanos</h4>
        <div className="row mb-5">
          <div className="col-md-6">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti perferendis
              necessitatibus doloribus temporibus. Facere, molestias obcaecati officia laudantium
              temporibus ad voluptatibus vero dolores? Rerum magnam sint, saepe recusandae quasi a!
            </p>
          </div>
          <div className="col-md-6">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti perferendis</p>
            <p>Lorem ipsum dolor </p>
            <p>Lorem ipsum dolor </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  {...register('name', { required: true })}
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="start_date">
                <Form.Label>Correo</Form.Label>
                <Form.Control {...register('email', { required: true })} type="email" />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>Telefono</Form.Label>
                <Form.Control {...register('telephone', { required: true })} type="text" />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="end_date">
                <Form.Label>Asunto</Form.Label>
                <Form.Control {...register('asunto', { required: true })} type="text" />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control {...register('description')} as="textarea" rows={3} />
          </Form.Group>

          <div className="mt-5 d-flex gap-4 justify-content-center">
            <Button className="text-white" type="submit" variant="success">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactanosPage
