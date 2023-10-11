import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

var userRole = window
const _nav = [
  {
    component: CNavItem,
    name: 'Asset Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: '',
    },
  },
  {
    component: CNavTitle,
    name: 'Asset',
  }, 
  {
    component: CNavGroup,
    name: 'Activity',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
     /*    {
        component: CNavItem,
        name: 'Asset',
        to: '/base/assetview',
      },
   {
        component: CNavItem,
        name: 'Disposal',
        to: '/base/disposeview',
      },*/
      {
        component: CNavItem,
        name: 'Approve Dispose',
        to: '/base/disposeapprover',
      },
      {
        component: CNavItem,
        name: 'Asset Checkin',
        to: '/base/assetuserassign',
      },
      {
        component: CNavItem,
        name: 'Pullout',
        to: '/base/assetpullout',
      },
      {
        component: CNavItem,
        name: 'PassBcrypt',
        to: '/base/passbcrypt',
      },
     /*     
      {
        component: CNavItem,
        name: 'Asset Checkout',
        to: '/base/assetuser',
      },

      {
        component: CNavItem,
        name: 'My Assets',
        to: '/base/assetbyuser',
      },

      */
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Configurations',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      /*{
        component: CNavItem,
        name: 'Test Checkoutemail',
        to: '/configurations/checkoutemail',
      },
      */
      {
        component: CNavItem,
        name: 'Asset Category',
        to: '/configurations/categoryview',
      },
      {
        component: CNavItem,
        name: 'User Group',
        to: '/configurations/usercategoryview',
      },
      {
        component: CNavItem,
        name: 'Status',
        to: '/configurations/statusview',
      },
      {
        component: CNavItem,
        name: 'Department',
        to: '/configurations/departmentview',
      },
      {
        component: CNavItem,
        name: 'Position',
        to: '/configurations/positionview',
      },
      {
        component: CNavItem,
        name: 'Employee(s)',
        to: '/configurations/userview',
      },
      {
        component: CNavItem,
        name: 'Supplier',
        to: '/configurations/supplierview',
      },
      {
        component: CNavItem,
        name: 'Logs',
        to: '/configurations/logview',
      },
     /* {
        component: CNavItem,
        name: 'Pullout',
        to: '/configurations/viewpullout',
      },*/
    ],
  },
/*
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Template',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },

      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },

      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  }, */
  /*
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  }, */ 

  /* 
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  }, */

  /*
  {
    component: CNavTitle,
    name: 'Extras',
  },
  */
 
  {
    component: CNavGroup,
    name: 'MyAccount',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Update Profile',
        to: '/pages/updateprofile',
      },
/*
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
*/
    ],
  },
  /*
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
*/
]

export default _nav
