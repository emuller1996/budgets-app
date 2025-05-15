/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useBudget } from '../../hooks/useBudget'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
import { Link } from 'react-router-dom'
import CompanyForm from './components/CompanyForm'
import { useCompany } from '../../hooks/useCompany'

export default function CompaniesPage() {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { getAllCompany, data } = useCompany()

  useEffect(() => {
    getAllCompany()
  }, [Draw])

  return (
    <div>
      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompanyForm
            onHide={handleClose}
            getAllCompanies={() => {
              setDraw((status) => ++status)
            }}
          />
        </Modal.Body>
      </Modal>
      <div>
        <Button variant="primary" onClick={handleShow}>
          Create Company
        </Button>
      </div>
      <div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              /* {
                name: 'Id',
                selector: (row) => row._id,
                width: '60px',
                cell: (row) => {
                  return (
                    <>
                      <Link to={`${row._id}/detail`} className="btn btn-info btn-sm text-white">
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    </>
                  )
                },
              }, */
              {
                name: 'name_company',
                selector: (row) => row?.name_company ?? '',
                minWidth: '150px',
              },
              { name: 'industry', selector: (row) => row?.industry ?? '', minWidth: '150px' },
              {
                name: 'code_company',
                selector: (row) => row?.code_company ?? '',
                minWidth: '150px',
              },
              { name: 'phone', selector: (row) => row?.phone ?? '', minWidth: '150px' },
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
