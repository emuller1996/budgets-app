/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useBudget } from '../../hooks/useBudget'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
import { Link } from 'react-router-dom'
import { useProyect } from '../../hooks/useProyect'

export default function ProyectsPage() {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { getAllProyects,data } = useProyect()

  useEffect(() => {
    getAllProyects()
  }, [Draw])

  return (
    <div>
      <div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              {
                name: 'Id',
                selector: (row) => row._id,
                width: '60px',
                cell: (row) => {
                  return (
                    <>
                      <Link
                       
                       to={`${row._id}/detail`}
                        className="btn btn-info btn-sm text-white"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    </>
                  )
                },
              },
              { name: 'name_proyect', selector: (row) => row?.name_proyect ?? '', minWidth: '150px' },
              { name: 'amount', selector: (row) => ViewDollar(row?.amount) ?? '', minWidth: '150px' },
              { name: 'available_amount', selector: (row) => ViewDollar(row?.available_amount) ?? '', minWidth: '150px' },
              { name: 'assigned_amount', selector: (row) => ViewDollar(row?.assigned_amount) ?? '', minWidth: '150px' },
              { name: 'used_amount', selector: (row) => ViewDollar(row?.used_amount) ?? '', minWidth: '150px' },
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
