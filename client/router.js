import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import App from './components/App.jsx';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/Sidebar.js';
import Cars from './components/Content/Cars';
import Customers from './components/Content/Customers';

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

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={routerComponent}>
      <IndexRoute component={App} />
      <Route path="cars" component={Cars}/>
      <Route path="customers" component={Customers}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);