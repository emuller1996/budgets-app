import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Budget Management',
  },
  {
    component: CNavItem,
    name: 'Budgets',
    to: '/budgets',
    icon: (
      <i style={{ width: '30px' }} className="fa-solid fa-magnifying-glass-dollar nav-icon"></i>
    ),
  },
  {
    component: CNavItem,
    name: 'Proyects',
    to: '/proyects',
    icon: <i style={{ width: '30px' }} className="fa-solid fa-diagram-project nav-icon"></i>,
  },
  {
    component: CNavTitle,
    name: 'Companies Management',
  },
  {
    component: CNavItem,
    name: 'Companies',
    to: '/companies',
    icon: <i className="fa-solid fa-building nav-icon"></i>,
  },

  {
    component: CNavTitle,
    name: 'Configuraciones',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/d/usuarios',
    icon: <i style={{ width: '30px' }} className="fa-solid fa-users nav-icon"></i>,
  },
]

export default _nav
