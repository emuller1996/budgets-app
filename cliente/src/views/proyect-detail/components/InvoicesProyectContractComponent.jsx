/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap'
import { ViewDollar } from '../../../utils'
import ProyectContractForm from './ProyectContractForm'
import InvoiceContractForm from './InvoiceContractForm'
import DataTable from 'react-data-table-component'
import TimeAgo from 'timeago-react'

export default function InvoicesProyectContractComponent({ AllInvoices, Invoices }) {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Create Invoice
      </Button>
      <div>
        <div className="row mt-2 g-2">
          {Invoices && (
            <>
              <DataTable
                data={Invoices}
                pagination
                columns={[
                  {
                    name: 'Id',
                    selector: (row) => row._id,
                    width: '60px',
                    cell: (row) => {
                      return <></>
                    },
                  },
                  {
                    name: 'description',
                    selector: (row) => row?.description ?? '',
                    minWidth: '150px',
                  },
                  {
                    name: 'amount',
                    selector: (row) => ViewDollar(row?.amount) ?? '',
                    minWidth: '150px',
                  },

                  {
                    name: 'contract',
                    selector: (row) => row?.contract_object?.name_contract ?? '',
                    minWidth: '150px',
                  },

                  {
                    cell: (row) => {
                      return (
                        <TimeAgo
                          datetime={row?.createdTime}
                          locale='es'
                        />
                      )
                    }
                  }
                ]}
              />
            </>
          )}
        </div>
      </div>

      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InvoiceContractForm onHide={handleClose} getAllInvoices={AllInvoices} />
        </Modal.Body>
      </Modal>
    </div>
  )
}
