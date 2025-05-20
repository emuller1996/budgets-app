/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Button, Card, Modal, ProgressBar } from 'react-bootstrap'
import { ViewDollar } from '../../../utils'
import ProyectContractForm from './ProyectContractForm'
import TimeAgo from 'timeago-react'

export default function ProyectContractComponent({ AllContracts, Contracts }) {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Create Contract
      </Button>
      <div>
        <div className="row mt-2 g-2">
          {Contracts &&
            Contracts.map((pro) => (
              <>
                <div className="col-12">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <span>Name</span>
                        <span className="fw-bold">{pro?.name_contract}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Company</span>
                        <span className="fw-bold">{pro?.company_object?.name_company}</span>
                      </div>
                      <div className='col-6'>
                        <div className="d-flex justify-content-between ">
                          <span>Date</span>
                          <span className="fw-bold"><TimeAgo
                            datetime={pro?.createdTime}
                            locale='es'
                          /></span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Available amount</span>
                        <span className="fw-bold">{ViewDollar(pro?.available_amount)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Used Amount</span>
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
                    </Card.Body>
                  </Card>
                </div>
              </>
            ))}
        </div>
      </div>

      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProyectContractForm onHide={handleClose} getAllBudgets={AllContracts} />
        </Modal.Body>
      </Modal>
    </div>
  )
}
