import React from 'react'
import UsuariosPage from './views/usuarios/UsuariosPage'
import BudgetsPage from './views/budgets/BudgetsPage'
import BudgetDetail from './views/budget-detail/BudgetDetail'
import ProyectsPage from './views/proyects/ProyectsPage'
import ProyectDetail from './views/proyect-detail/ProyectDetail'
import CompaniesPage from './views/companies/CompaniesPage'

const DashboardTwo = React.lazy(() => import('./views/dashboard/DashboardTwo'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: DashboardTwo },
  { path: '/budgets', name: 'Budgets', element: BudgetsPage },
  { path: '/budgets/:id/detail', name: 'Budget Detail', element: BudgetDetail },
  { path: '/proyects', name: 'Budgets', element: ProyectsPage },
  { path: '/proyects/:id/detail', name: 'Budget Detail', element: ProyectDetail },
  { path: '/usuarios', name: 'Ordenes', element: UsuariosPage },
  { path: '/companies', name: 'Ordenes', element: CompaniesPage },
]

export default routes
