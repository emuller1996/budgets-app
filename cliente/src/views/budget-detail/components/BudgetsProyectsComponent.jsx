/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Button, Card, Modal, ProgressBar } from 'react-bootstrap'
import BudgetProyectForm from './BudgetProyectForm'
import { ViewDollar } from '../../../utils'
import { Link } from 'react-router-dom'

export default function BudgetsProyectsComponent({ AllBudget, Proyects }) {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Create Proyects
      </Button>
      <div>
        <div className="row mt-2 g-2">
          {Proyects &&
            Proyects.map((pro) => (
              <>
                <div className="col-12">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <span>Name</span>
                        <span className="fw-bold fs-4">{pro?.name_proyect}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Amount</span>
                        <span className="fw-bold text-success">{ViewDollar(pro?.amount)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Available amount</span>
                        <span className="fw-bold text-success">{ViewDollar(pro?.available_amount)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Assigned amount</span>
                        <span className="fw-bold text-warning">{ViewDollar(pro?.assigned_amount)}</span>
                      </div>
                      <ProgressBar>
                        {pro && (
                          <ProgressBar
                            striped
                            variant="warning"
                            now={(pro.assigned_amount / pro.amount) * 100}
                            key={1}
                          />
                        )}
                      </ProgressBar>

                      <div className="d-flex justify-content-between">
                        <span>used_amount amount</span>
                        <span className="fw-bold text-danger">{ViewDollar(pro?.used_amount)}</span>
                      </div>
                      <ProgressBar>
                        {pro && (
                          <ProgressBar
                            striped
                            variant="danger"
                            now={(pro.used_amount / pro.amount) * 100}
                            key={1}
                          />
                        )}
                      </ProgressBar>
                      <div className='mt-3 tex-center d-flex justify-content-center'>
                        <Link
                          to={`/proyects/${pro._id}/detail`}
                          type="button"
                          className="btn btn-primary"
                        >
                          View Detail
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </>
            ))}
        </div>
      </div>

      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Proyects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BudgetProyectForm onHide={handleClose} getAllBudgets={AllBudget} />
        </Modal.Body>
      </Modal>
    </div>
  )
}
