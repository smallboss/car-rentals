import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import App from './components/App.jsx';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar.js';
import Cars from './components/Content/Cars';
import CarSingle from './components/Content/Cars/CarSingle.js';
import Customers from './components/Content/Customers';
import Customer from './components/Content/Customers/Customer'
import Registration from './components/Content/Registration'
import CustomersList from './components/Content/Customers/CustomersList'

const NotFoundPage = () => {
  return (
    <div>
      Error: 404 (Not Found)
    </div>
  )
};

const routerComponent = ({children}) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className='content'>
        {children}
      </div>
      <Footer />
    </div>
  )
};

Router.refresh = function () {
    Router.dispatch(location.getCurrentPath(), null)
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={routerComponent}>
<<<<<<< HEAD
      <IndexRoute component={App} />
      <Route path="cars" component={Cars}/>
      <Route path="cars/:carId" component={CarSingle} />
      
      <Route path="customers" component={Customers}/>
      <Route path="*" component={NotFoundPage}/>
=======
        <IndexRoute component={App} />
        <Route path="registration" component={Registration}/>
        <Route path="cars" component={Cars}/>
        <Route path="customers" component={Customers} />
        <Route path="customers_list" component={CustomersList} />
        <Route path='customer/:id' component={Customer} />
        <Route path="*" component={NotFoundPage}/>
>>>>>>> origin
    </Route>
  </Router>
);