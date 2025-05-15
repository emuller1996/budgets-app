import React, { useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Toaster } from 'react-hot-toast'
import { Card, Carousel, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Landing from '../views/landing/Landing'
import './LandingLayout.css'
import logo from '../assets/LOGOEVENTOS.png'
import ShowShopPage from '../views/landing/ShowShopPage'
import PuntoVentaPage from '../views/landing/PuntoVentaPage'
import ContactanosPage from '../views/landing/ContactanosPage'

const LandingLayout = () => {
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }
  return (
    <div>
      <nav className="mullnavbar navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={logo} height={'70px'} width={'180px'} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to={''}
                  className={({ isActive, isPending }) =>
                    isPending ? 'pending' : isActive ? 'nav-link  fw-bold' : ' nav-link'
                  }
                  aria-current="page"
                  href="#"
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={'puntos-ventas'}
                  className={({ isActive, isPending }) =>
                    isPending ? 'pending' : isActive ? 'nav-link  fw-bold' : ' nav-link'
                  }
                >
                  Puntos de Venta
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={'contactanos'}
                  className={({ isActive, isPending }) =>
                    isPending ? 'pending' : isActive ? 'nav-link  fw-bold' : ' nav-link'
                  }
                  href="#"
                >
                  Contactanos
                </NavLink>
              </li>
            </ul>
            <span className="navbar-text">
              <div className="d-flex gap-4 justify-content-center">
                <Link className="nav-link" to={`/login`}>
                  Login
                </Link>
                <Link className="nav-link" to={`/d/`}>
                  Admin
                </Link>
              </div>
            </span>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          key={'puntos-ventas'}
          path={'/puntos-ventas'}
          exact={true}
          name={'Puntos de Ventas'}
          element={
            <>
              <PuntoVentaPage />
            </>
          }
        />
        <Route
          key={'puntos-ventas'}
          path={'/'}
          exact={true}
          name={'Puntos de Ventas'}
          element={
            <>
              <Landing />
            </>
          }
        />
        <Route
          key={'contactanos'}
          path={'/contactanos'}
          exact={true}
          name={'Contactanos'}
          element={
            <>
              <ContactanosPage />
            </>
          }
        />
        <Route
          key={'comprar-boletos'}
          path={'/show/:idShow'}
          exact={true}
          name={'Comprar Boleto'}
          element={
            <>
              <ShowShopPage />
            </>
          }
        />
      </Routes>

      <div className="container-fluid bg-white">
        <div className="container">
          <footer className="py-3 mt-4 ">
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-muted">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-muted">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-muted">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-muted">
                  FAQs
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-muted">
                  About
                </a>
              </li>
            </ul>
            <p className="text-center text-muted">© 2022 Company, Inc</p>
          </footer>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default LandingLayout
