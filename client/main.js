import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import { renderRoutes } from './router';
import App from './components/App.jsx';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});