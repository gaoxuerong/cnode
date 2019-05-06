import React, { Component } from 'react';
import Routes from '../config/router'
import AppBar from './layout/app-bar'

class App extends Component {
  render() {
    return [
      <AppBar key="app-bar" />,
      <Routes key="routes" />,
    ]
  }
}

export default App;
