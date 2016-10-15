import React from 'react';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

// route components
import App from './components/App.jsx';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar.js';
import Home from './components/Content/Home';
import Payments from './components/Content/Payments';
import PaymentSingle from './components/Content/Payments/PaymentSingle.js';
import UserProfile from './components/Content/UserProfile'
import Cars from './components/Content/Cars';
import CarSingle from './components/Content/Cars/CarSingle.js';
import Invoices from './components/Content/Invoices';
import InvoiceSingle from './components/Content/Invoices/InvoiceSingle.js';
import Contracts from './components/Content/Contracts';
import ContractSingle from './components/Content/Contracts/ContractSingle.js';
import Customers from './components/Content/Customers';
import Customer from './components/Content/Customers/Customer'
import Users from './components/Content/Users'
import TableForUser from './components/Content/Users/TableForUser'
import UserSingle from './components/Content/Users/UserSingle'
import Registration from './components/Content/Registration'
import CustomersList from './components/Content/Customers/CustomersList'
/*import back components*/
import BackSidebar from './components/ManagePartition/BackSidebar'
import BackHeader from './components/ManagePartition/BackHeader'
import BackFooter from './components/ManagePartition/BackFooter'

const NotFoundPage = () => {
  return (
    <div>
      Error: 404 (Not Found)
    </div>
  )
};

const frontRouterComponent = (children) => {
  return (
    <div id='main_container'>
      <Header />
      <Sidebar />
      <div className='content'>
        {children}
      </div>
      <Footer />
    </div>
  )
};

const backRouterComponent = (children) => {
  return (
    <div id='main_container'>
      <BackHeader />
      <BackSidebar />
      <div className='content'>
        {children}
      </div>
      <BackFooter />
    </div>
  );
};

const wrapper = ({children}) => {
  if(location.href.indexOf('managePanel') != -1) {
    return backRouterComponent(children);
  }
  return frontRouterComponent(children);
};

Router.refresh = function () {
  Router.dispatch(location.getCurrentPath(), null)
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={wrapper}>
      <IndexRoute component={App}/>
      <Route path="home" component={Home}/>
      <Route path="registration" component={Registration}/>
      <Route path="user_profile" component={UserProfile}/>
      <Route path="user_profile/:tableTarget" component={TableForUser}/>
      <Route path="/managePanel">
        <IndexRoute component={CustomersList}/>
        <Route path="cars" component={Cars}/>
        <Route path="cars/:carId" component={CarSingle}/>
        <Route path="payments" component={Payments}/>
        <Route path="payments/:paymentId" component={PaymentSingle}/>
        <Route path="contracts" component={Contracts}/>
        <Route path="contracts/:contractId" component={ContractSingle}/>
        <Route path="invoices" component={Invoices}/>
        <Route path="invoices/:invoiceId" component={InvoiceSingle}/>
        <Route path="customers" component={Customers}/>
        <Route path="customers_list" component={CustomersList}/>
        <Route path='customer/:id' component={Customer}/>
        <Route path='users_list' component={Users}/>
        <Route path='user_single/:id' component={UserSingle}/>
        <Route path="*" component={NotFoundPage}/>
      </Route>
      <Route path="*" component={NotFoundPage}/>
    </Route>

  </Router>
);