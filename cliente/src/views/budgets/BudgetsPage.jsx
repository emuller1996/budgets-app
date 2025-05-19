/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, Modal, ProgressBar } from 'react-bootstrap'
import BudgetForm from './components/BudgetForm'
import { useBudget } from '../../hooks/useBudget'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
import { Link } from 'react-router-dom'

export default function BudgetsPage() {
  const [show, setShow] = useState(false)
  const [showDelete, setShowDelete] = useState(null)

  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { getAllBudgets, data } = useBudget()

  useEffect(() => {
    getAllBudgets()
  }, [Draw])

  return (
    <div>
      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BudgetForm
            onHide={handleClose}
            getAllBudgets={() => {
              setDraw((status) => ++status)
            }}
          />
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        centered
        show={showDelete?.show}
        onHide={() => {
          setShowDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Are you sure you want to delete this budget?</p>
          <p className="text-center m-0">{showDelete?.name_budget}</p>
          <p className="text-center m-0">{ViewDollar(showDelete?.available_amount)}</p>

        </Modal.Body>
      </Modal>
      <div>
        <Button variant="primary" onClick={handleShow}>
          Create Budget
        </Button>
      </div>
      <div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              {
                name: 'Id',
                selector: (row) => row._id,
                width: '160px',
                cell: (row) => {
                  return (
                    <>
                      <Link to={`${row._id}/detail`} className="btn btn-info btn-sm text-white">
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                      <Button
                        variant="primary"
                        className="ms-2"
                        size="sm"
                        onClick={() => {
                          setShowDelete({ ...row, show: true })
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </>
                  )
                },
              },
              { name: 'name_budget', selector: (row) => row?.name_budget ?? '', minWidth: '150px' },
              {
                name: 'amount',
                selector: (row) => ViewDollar(row?.amount) ?? '',
                minWidth: '100px',
              },
              {
                name: 'available_amount',
                selector: (row) => ViewDollar(row?.available_amount) ?? '',
                minWidth: '100px',
              },
              {
                name: 'assigned_amount',
                selector: (row) => ViewDollar(row?.assigned_amount) ?? '',
                minWidth: '100px',
              },
              {
                name: 'used_amount',
                selector: (row) => ViewDollar(row?.used_amount) ?? '',
                minWidth: '100px',
              },
              { name: 'start_date', selector: (row) => row?.start_date ?? '' },
              { name: 'end_date', selector: (row) => row?.end_date ?? '' },
              {
                name: ' ',
                minWidth: '100px',
                cell: (row) => {
                  return (
                    <div style={{width:"100px"}}>
                      <ProgressBar className='mt-3 w-100' >
                        <ProgressBar
                          striped
                          variant="danger"
                          now={(row.used_amount / row.amount) * 100}
                          key={1}
                        />
                      </ProgressBar>
                    </div>
                  )
                }
              }
            ]}
            data={data ?? []}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent="No hay datos para mostrar"
          />
        </div>
      </div>
    </div>
  )
}
