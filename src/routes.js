import React from 'react'
import Supplier from './views/configurations/supplier/Supplier'

import t from "../src/views/pages/page404/Page404"


const Page404 = React.lazy(() => import('../src/views/pages/page404/Page404'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Dashboard1 = React.lazy(() => import('./views/dashboard/dashboard1/Dashboard1'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
// replace by assetregister
//const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const AssetRegister = React.lazy(() => import('./views/base/assetregister/AssetRegister'))
const AssetUser = React.lazy(() => import('./views/base/assetuser/AssetUser'))
const AssetView = React.lazy(() => import('./views/base/assetview/AssetView'))
const AssetUserAssign = React.lazy(() => import('./views/base/assetuserassign/AssetUserAssign'))
const AssetByUser = React.lazy(() => import('./views/base/assetbyuser/AssetByUser'))
const AssetPullout = React.lazy(() => import('./views/base/assetpullout/AssetPullout'))
const AssetEdit = React.lazy(() => import('./views/base/assetedit/AssetEdit'))
const AssetDispose = React.lazy(() => import('./views/base/assetdispose/AssetDispose'))
const DisposeView = React.lazy(() => import('./views/base/disposeview/DisposeView'))

//For Testing 
const Snipe = React.lazy(() => import('./views/base/snipe/Snipe'))

const Logout = React.lazy(() => import('./views/base/logout/Logout'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))


// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))
///// Configurations
const AssetCategory = React.lazy(() => import('./views/configurations/assetcategory/AssetCategory'))
const CategoryView = React.lazy(() => import('./views/configurations/categoryview/CategoryView'))
const AssetStatus = React.lazy(() => import('./views/configurations/assetstatus/AssetStatus'))
const StatusView = React.lazy(() => import('./views/configurations/statusview/StatusView'))
const DepartmentView = React.lazy(() => import('./views/configurations/departmentview/DepartmentView'))
const Department = React.lazy(() => import('./views/configurations/department/Department'))
const PositionView = React.lazy(() => import('./views/configurations/positionview/PositionView'))
const Position = React.lazy(() => import('./views/configurations/position/Position'))
const UserView = React.lazy(() => import('./views/configurations/userview/UserView'))
const LogView = React.lazy(() => import('./views/configurations/logview/LogView'))
const Log = React.lazy(() => import('./views/configurations/log/Log'))
const ViewPullout = React.lazy(() => import('./views/configurations/viewpullout/ViewPullout'))
const ViewPulloutUser = React.lazy(() => import('./views/configurations/viewpulloutuser/ViewPulloutUser'))
const CheckoutEmail = React.lazy(() => import('./views/configurations/checkoutemail/CheckoutEmail'))
const UserCategoryView = React.lazy(() => import('./views/configurations/usercategoryview/UserCategoryView'))
const UserCategory = React.lazy(() => import('./views/configurations/usercategory/UserCategory'))
const SupplierView = React.lazy(() => import('./views/configurations/supplierview/SupplierView'))
const LogUserInfoView = React.lazy(() => import('./views/configurations/loguserinfoview/LogUserInfoView'))
const LogAllInfoView = React.lazy(() => import('./views/configurations/logallinfoview/LogAllInfoView'))
const DepreciatedView = React.lazy(() => import('./views/configurations/depreciatedview/DepreciatedView'))
//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

//Pages 
//
const UpdateProfile = React.lazy(() => import('./views/pages/updateprofile/UpdateProfile'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  
  { path: '*', exact: true, element: Page404 },
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
 // { path: '/dashboard/dashboard1', name: 'Dashboard1', element: Dashboard1 },
  
 /*
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  //{ path: '/base/accordion', name: 'Accordion', element: Accordion },
*/
  //For Testing 
  { path: '/base/snipe', name: 'Snipe', element: Snipe },

  { path: '/base/assetregister', name: 'AssetRegister', element: AssetRegister },
  { path: '/base/assetuser', name: 'AssetUser', element: AssetUser },
  { path: '/base/assetview', name: 'AssetView', element: AssetView },
  { path: '/base/assetuserassign', name: 'AssetUserAssign', element: AssetUserAssign },
  { path: '/base/assetbyuser', name: 'AssetByUser', element: AssetByUser },
  { path: '/base/assetpullout', name: 'AssetPullout', element: AssetPullout },
  { path: '/base/assetedit', name: 'AssetEdit', element: AssetEdit },
  { path: '/base/assetdispose', name: 'AssetDispose', element: AssetDispose },
  { path: '/base/disposeview', name: 'DisposeView', element: DisposeView },

  
  
/*
  { path: '/base/logout', name: 'Logout', element: Logout },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },

  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
*/

  /// For Configurations

  { path: '/configurations/categoryview', name: 'CategoryView', element: CategoryView },
  { path: '/configurations/assetcategory', name: 'AssetCategory', element: AssetCategory },
  { path: '/configurations/assetstatus', name: 'AssetStatus', element: AssetStatus },
  { path: '/configurations/statusview', name: 'StatusView', element: StatusView },
  { path: '/configurations/departmentview', name: 'DepartmentView', element: DepartmentView },
  { path: '/configurations/department', name: 'Department', element: Department },
  { path: '/configurations/positionview', name: 'PositionView', element: PositionView },
  { path: '/configurations/position', name: 'Position', element: Position },
  { path: '/configurations/userview', name: 'UserView', element: UserView },
  { path: '/configurations/logview', name: 'LogView', element: LogView },
  { path: '/configurations/log', name: 'Log', element: Log },
  { path: '/configurations/viewpullout', name: 'ViewPullout', element: ViewPullout },
  { path: '/configurations/viewpulloutuser', name: 'ViewPulloutUser', element: ViewPulloutUser },
  { path: '/configurations/checkoutemail', name: 'CheckoutEmail', element: CheckoutEmail },
  { path: '/configurations/usercategoryview', name: 'UserCategoryView', element: UserCategoryView },
  { path: '/configurations/usercategory', name: 'UserCategory', element: UserCategory },
  { path: '/configurations/supplierview', name: 'SupplierView', element: SupplierView },
  { path: '/configurations/supplier', name: 'Supplier', element: Supplier },
  { path: '/configurations/loguserinfoview', name: 'LogUserInfoView', element: LogUserInfoView },
  { path: '/configurations/logallinfoview', name: 'LogAllInfoView', element: LogAllInfoView },
  { path: '/configurations/depreciatedview', name: 'DepreciatedView', element: DepreciatedView },
  
/*
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
*/

  // pages for update profile
  { path: '/pages/updateprofile', name: 'UpdateProfile', element: UpdateProfile },


]

export default routes
