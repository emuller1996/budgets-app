import React, { useEffect, useState } from 'react'
import { useFunciones } from '../../hooks/useFunciones'
import { useParams } from 'react-router-dom'
import { Accordion, Card, Form } from 'react-bootstrap'
import FormOrdenes from '../ordenes/components/FormOrdenes'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { useForm } from 'react-hook-form'
import { ViewDollar } from '../../utils'
import { getBoletoBySeccionByidService } from '../../services/funciones.services'
import { postCrearOrdenService } from '../../services/ordenes.services'
import toast from 'react-hot-toast'
import { Payment, initMercadoPago } from '@mercadopago/sdk-react'
import axios from 'axios'

initMercadoPago(import.meta.env.VITE_MERCA_PUBLIC_KEY)

const ShowShopPage = () => {
  const { getFuncionById, dataDetalle } = useFunciones()

  const { idShow } = useParams()
  const [BoletosSelecionados, setBoletosSelecionados] = useState([])
  const [OpcionesBoletos, setOpcionesBoletos] = useState(null)
  const [pasoActive, setPasoActive] = useState('0')
  const [total, settotal] = useState(null)
  const [dataPayment, setdataPayment] = useState(null)

  const initialization = {
    amount: 100000,
    preferenceId: new Date().getTime(),
  }
  const customization = {
    paymentMethods: {
      //ticket: 'all',
      //bankTransfer: 'all',
      creditCard: 'all',
      debitCard: 'all',
      //mercadoPago: 'all',
    },
  }
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      formData.ordenData = watch()
      formData.ordenData.total_order = parseFloat(total)
      formData.ordenData.boletos = BoletosSelecionados
      formData.ordenData.funcion_id = idShow
      formData.ordenData.evento_id = dataDetalle.evento_id
      console.log(formData)
      axios
        .post('/ordenes/process_payment', JSON.stringify(formData), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          // recibir el resultado del pago
          console.log(response)
          if (response.data.mercaResponse.status === 'approved') {
            toast.success('SE GENERO SU ORDE')
            setPasoActive('3')
            setdataPayment(response.data.mercaResponse)
            resolve()
          } else {
            //toast.error('HUBO UN ERROR EN EL PROCESO DE PAGO')
            let txtError = ''
            if (response.data.mercaResponse.status_detail === 'cc_rejected_insufficient_amount') {
              txtError = 'La tarjeta no cuenta con los fondos para el cobro de la orden.'
            }
            if (response.data.mercaResponse.status_detail === 'cc_rejected_other_reason') {
              txtError = 'La tarjeta ha sido rechazada por otras razones.'
            }

            toast((t) => (
              <div className="" role="alert">
                <span className="fw-bold text-center">ERROR AL PROCESAR EL PAGO</span>
                <span className="d-block">
                  {txtError}
                  <button className="btn btn-sm btn-danger" onClick={() => toast.dismiss(t.id)}>
                    Dismiss
                  </button>
                </span>
              </div>
            ))
            reject()
          }
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject()
        })
    })
  }
  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error)
  }
  const onReady = async () => {
    /*
      Callback llamado cuando el Brick está listo.
      Aquí puede ocultar cargamentos de su sitio, por ejemplo.
    */
  }

  useEffect(() => {
    getFuncionById(idShow)
  }, [])
  useEffect(() => {
    setOpcionesBoletos(
      dataDetalle?.evento?.sections_price?.map((sec) => {
        return {
          label: `${sec.name_section}`,
          value: `${sec.name_section}`,
          data: sec,
        }
      }),
    )
  }, [dataDetalle])

  useEffect(() => {
    settotal(BoletosSelecionados.reduce((prev, curr) => prev + curr.price, 0))
  }, [BoletosSelecionados])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmitCreateOrder = async (data) => {
    if (BoletosSelecionados.length === 0) {
      return toast.error('Debe Agregar almenos un Boleto.')
    }
    console.log(data)
    console.log(
      BoletosSelecionados.map((bol) => {
        return {
          _id: bol._id,
          price: bol.price,
          num_ticket: bol.num_ticket,
        }
      }),
    )
    data.boletos = BoletosSelecionados.map((bol) => {
      return {
        _id: bol._id,
        price: bol.price,
        num_ticket: bol.num_ticket,
        section: bol.section,
      }
    })
    data.evento_id = dataDetalle?.evento._id
    data.funcion_id = idShow._id
    data.total_order = parseFloat(BoletosSelecionados.reduce((prev, curr) => prev + curr.price, 0))
    console.log(data)

    try {
      const res = await postCrearOrdenService(data)
      toast.success(res.data.message)
      reset()
      setBoletosSelecionados([])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row g-4">
        <div className="col-md-9 col-lg-8">
          {dataDetalle && <Card.Img height={'500px'} variant="top" src={dataDetalle?.image} />}
        </div>
        <div className="col-md-3 col-lg-4">
          <h3 className="fw-semibold">{dataDetalle && dataDetalle?.name}</h3>
          <p>{dataDetalle?.description}</p>
          <span className="d-block mt-3">Evento : {dataDetalle?.evento?.name}</span>
          <span className="d-block ">Categoria : {dataDetalle?.evento?.category}</span>

          <div className="mt-3 d-flex justify-content-start align-items-center">
            <i className="fa-solid fa-map-location-dot fa-2x"></i>
            <div>
              <span className="ms-3 d-block">{dataDetalle?.recinto?.name}</span>
              <span className="ms-3 d-block">{dataDetalle?.recinto?.city}</span>
              <span className="ms-3 d-block">{dataDetalle?.recinto?.address}</span>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitCreateOrder)} className="row g-4 mt-4">
        <div className="col-md-6">
          <img className="img-fluid" src={dataDetalle?.esquema?.image} />
        </div>
        <div className="col-md-6">
          <div className="row g-3">
            {dataDetalle?.evento?.sections_price.map((sect) => (
              <>
                <div key={sect.name_section} className="col-12">
                  <div className="card p-2">
                    <span className="d-block text-center fs-4 fw-semibold">
                      {sect.name_section}
                    </span>
                    <div className="d-flex justify-content-between">
                      <span className="">
                        <i className="fa-solid fa-people-line me-2"></i>Aforo : {sect.aforo}
                      </span>
                      <span className="fw-bold text-success">
                        <i className="fa-solid fa-money-bill me-2"></i>
                        {ViewDollar(sect.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <Accordion defaultActiveKey="0" activeKey={pasoActive}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <i className="fa-solid fa-user me-3"></i>Informacion Basica
            </Accordion.Header>
            <Accordion.Body>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="name_client">
                    <Form.Label>Nombre Cliente</Form.Label>
                    <Form.Control
                      {...register('name_client')}
                      type="text"
                      placeholder="Ingrese el Nombre del cliente aca"
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="email_client">
                    <Form.Label>Correo Cliente</Form.Label>
                    <Form.Control
                      {...register('email_client')}
                      type="text"
                      placeholder="Ingrese el Nombre del cliente aca"
                    />
                  </Form.Group>
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setPasoActive('1')
                    }}
                  >
                    Siguente
                  </button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <i className="fa-solid fa-ticket  me-3"></i>Boletos
            </Accordion.Header>
            <Accordion.Body>
              <div className="col-md-12 mx-auto">
                <Select
                  /*  getOptionValue={(e) => {
                console.log(e)
              }} */
                  onChange={async (e) => {
                    console.log(e)
                    try {
                      const result = await getBoletoBySeccionByidService(idShow, {
                        section: e.value,
                      })

                      setBoletosSelecionados((status) => {
                        return [...status, { ...result.data.boleto, price: e.data.price }]
                      })
                    } catch (error) {
                      if (error.status === 400) {
                        toast.error(error.response.data.message)
                      }
                      console.log(error)
                    }
                  }}
                  placeholder="Selecione una Secion"
                  options={OpcionesBoletos}
                />
              </div>
              <div className="border p-2 rounded mt-3">
                <DataTable
                  noDataComponent="No Hay Boletos en la Orden."
                  columns={[
                    { name: 'Seccion', selector: (row) => row.section },
                    { name: 'Numero Boleto', selector: (row) => row.num_ticket },
                    { name: 'Precio', selector: (row) => row.price },
                  ]}
                  data={BoletosSelecionados}
                />
              </div>
              <div className="text-center mt-5">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setPasoActive('2')
                  }}
                >
                  Siguente
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <i className="fa-solid fa-money-bill me-3"></i>Metodo de Pago
            </Accordion.Header>
            <Accordion.Body>
              <div>
                {BoletosSelecionados.length !== 0 && pasoActive === '2' && (
                  <Payment
                    initialization={{ amount: total }}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                  />
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <i className="fa-regular fa-circle-check me-3"></i>Pago Realizado
            </Accordion.Header>
            <Accordion.Body>
              <div className="row">
                <p className="text-center">
                  <i className="fa-solid fa-check-double fa-2x me-3 text-success"></i>Tu Pago se ha
                  Recido con Exito
                </p>
                <p>
                  Tu Orden se ha generado sin problemas en unos momentos recibira un correo
                  electronico con la informacion de sus boletos.
                </p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="col-md-12">
          <div className="py-1">
            <hr />

            <div className="d-flex justify-content-center align-items-center gap-4 mt-4">
              <span> Total </span>
              <span className="fw-bold fs-5 text-success">
                {ViewDollar(BoletosSelecionados.reduce((prev, curr) => prev + curr.price, 0))}
              </span>
            </div>
            {/* <div className="text-center mt-4">
              <button className="btn btn-primary">General Orden</button>
            </div> */}
          </div>
        </div>
      </form>
      {total}
      <div className="container mt-5">
        <h3>TEST ShowShopPage {idShow}</h3>
      </div>
    </div>
  )
}

export default ShowShopPage
