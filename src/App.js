import React, { Component } from 'react';
import './App.css';
import Mapbox from './Mapbox.js'
import logo from './assets/spare-logo.jpg';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="michael-chan" />

          <div className="map-container">
            <Mapbox></Mapbox>
          </div>

        </header>
      </div>
    );
  }
}

export default App;
