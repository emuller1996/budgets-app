/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Badge, Card, ProgressBar, Tab, Tabs } from 'react-bootstrap'
import { useBudget } from '../../hooks/useBudget'
import { useParams } from 'react-router-dom'
import { ViewDollar } from '../../utils'
import BudgetsProyectsComponent from './components/BudgetsProyectsComponent'

export default function BudgetDetail() {
  const [key, setKey] = useState('proyects')

  const { getBudgetById, dataDetalle, getProyectsBudgetById, Proyects } = useBudget()
  const [Draw, setDraw] = useState(1)

  const { id } = useParams()

  useEffect(() => {
    getBudgetById(id)
    getProyectsBudgetById(id)
  }, [id, Draw])

  return (
    <Card>
      <Card.Body>
        <p className="fs-4">Detail Budget</p>
        <div className="row mb-3 g-4">
          <div className="col-md-6">
            <div className="d-flex justify-content-between  align-items-end">
              <span>Name Budget</span>
              <span className="fw-bold fs-3">{dataDetalle?.name_budget}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Category</span>
              <span className="fw-bold">{dataDetalle?.category}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>amount</span>
              <span className="fw-bold">{ViewDollar(dataDetalle?.amount)}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-between">
              <span>Available amount</span>
              <span className="fw-bold">{ViewDollar(dataDetalle?.available_amount)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>  <Badge bg="danger">U</Badge> Used amount</span>
              <span className="fw-bold">{ViewDollar(dataDetalle?.used_amount)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span> <Badge bg="warning">A</Badge> Assigned amount</span>
              <span className="fw-bold">{ViewDollar(dataDetalle?.assigned_amount)}</span>
            </div>
          </div>
        </div>
        <ProgressBar>
          {dataDetalle && (
            <ProgressBar
              striped
              variant="warning"
              now={(dataDetalle.assigned_amount / dataDetalle.amount) * 100}
              key={1}
            />
          )}
        </ProgressBar>
        <ProgressBar className='mt-3' >
          {dataDetalle && (
            <ProgressBar
              striped
              variant="danger"
              now={(dataDetalle.used_amount / dataDetalle.amount) * 100}
              key={1}
            />
          )}
        </ProgressBar>
        <hr />
        <div>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="proyects" title="Proyects">
              <BudgetsProyectsComponent
                Proyects={Proyects}
                AllBudget={() => setDraw((status) => ++status)}
              />
            </Tab>
            <Tab eventKey="companies" title="Companies">
              Soon Companies
            </Tab>
            <Tab eventKey="invoices" title="Invoices">
              Soon
            </Tab>
          </Tabs>
        </div>
      </Card.Body>
    </Card>
  )
}
