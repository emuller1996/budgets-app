import React, { useEffect, useState } from 'react'
import { useFunciones } from '../../hooks/useFunciones'
import { Link } from 'react-router-dom'
import { usePuntoVenta } from '../../hooks/usePuntoVenta'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PropTypes from 'prop-types'
import L from 'leaflet'

// Definir el icono personalizado
const customIcon = new L.Icon({
  iconUrl: 'https://eventos.esmuller.cloud/favicon.png', // Cambia esto por la ruta de tu imagen
  iconSize: [42, 42], // Tamaño del icono
  iconAnchor: [16, 32], // Punto de anclaje
  popupAnchor: [0, -32], // Punto de anclaje del popup
})

const PuntoVentaPage = () => {
  const { getAllPuntoVenta, data: ListPuntoVenta, loading, abortController } = usePuntoVenta()

  useEffect(() => {
    getAllPuntoVenta()

    return () => {
      console.log('test')
      console.log(abortController)
      abortController.abort()
    }
  }, [])

  function LocationPicker({ setCoordinates }) {
    LocationPicker.propTypes = {
      setCoordinates: PropTypes.func,
    }
    useMapEvents({
      click(e) {
        //setCoordinates(e.latlng) // Obtiene las coordenadas donde el usuario haga clic
      },
    })

    return null
  }
  return (
    <div>
      <div className="container mt-4">
        <h4 className="text-center ">Puntos Venta</h4>

        {ListPuntoVenta &&
          ListPuntoVenta.map((punto) => (
            <div
              key={punto._id}
              className="card  mb-3"
              style={{ border: '1px solid rgb(239 204 208)' }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between ">
                  <span className="fs-5">{punto?.name}</span>
                  <div>
                    <span className="badge bg-info fs-6 text-uppercase">
                      {punto?.type_sales_point}
                    </span>
                  </div>
                </div>

                <div className=" d-flex justify-content-start align-items-center">
                  <i className="fa-solid fa-map-location-dot fa-2x"></i>
                  <div>
                    <span className="ms-3 d-block">{punto?.name}</span>
                    <span className="ms-3 d-block">{punto?.city}</span>
                    <span className="ms-3 d-block">{punto?.address}</span>
                  </div>
                </div>
                {punto.coordinates && (
                  <>
                    <div
                      className="overflow-hidden rounded"
                      style={{ height: '300px', width: '100%' }}
                    >
                      <MapContainer
                        center={[punto.coordinates.lat, punto.coordinates.lng]}
                        zoom={15}
                        zoomControl={true}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {punto.coordinates && (
                          <Marker
                            icon={customIcon}
                            position={[punto.coordinates.lat, punto.coordinates.lng]}
                          >
                            <Popup>
                              {punto?.name}, {punto?.address}
                            </Popup>
                          </Marker>
                        )}
                        <LocationPicker /* setCoordinates={setCoordinates} */ />
                      </MapContainer>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PuntoVentaPage
