import React, { Component } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import './Mapbox.css';
import 'mapbox-gl/dist/mapbox-gl.css'

// note: mapbox token should be stored locally in separate file
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWljaGFlbC0zOCIsImEiOiJjam8wazR6amIwMTZrM2twbzk3dmd1ZGp2In0.7fZdbYKU1gxvl5KFV4-Eiw'

// define how often data should be fetched
const FETCH_INTERVAL = 3000

// define map reference to get viewport bounds
let myMap = null

class Mapbox extends Component {
  constructor(props){
    super(props)
    this.state = {
      viewport: {
        width: 900,
        height: 500,
        latitude: 49.2463,
        longitude: -123.1162,
        zoom: 11
      },
      viewport_bounds: {
        north: 0,
        south: 0,
        west: 0,
        east: 0,
      },
      active_vehicles: [],
      marker_size: 'small',
    };
  }

  _onViewportChange = viewport => {
    this.setState({viewport});
    this.updateViewportBounds()
    // Depending on zoom level, change Markers' class to dynamically change their display size
    if(this.state.viewport.zoom < 12.9) {
      this.setState({marker_size: 'marker-small'})
    } else if (this.state.viewport.zoom < 13.4) {
      this.setState({marker_size: 'marker-medium'})
    } else {
      this.setState({marker_size: 'marker-large'})
    }
  };

  updateViewportBounds = () => {
    let bounds = myMap.getBounds();
    this.setState({
      viewport_bounds: {
        north: bounds._ne.lat,
        south: bounds._sw.lat,
        west: bounds._sw.lng,
        east: bounds._ne.lng,
      }
    })
  }

  // fetch location data from endpoint
  fetchLocation = async () => {
    try {
      let locationURL = "/buses/location"
      const response = await fetch(locationURL)
      if(response.ok){
        const data = await response.json()
        this.setState({ active_vehicles: data })
      }
    }
    catch (e){
      console.log(e)
    }
  }

  // create markers/dots on UI to display live location of each vehicle
  createMarkers = () => {
    let markers = [];
    if(this.state.active_vehicles){
      for (let i = 0; i < this.state.active_vehicles.length; i++) {
        // if vehicle is within viewport bounds, display vehicle marker
        if(
          this.state.active_vehicles[i]['Latitude'] >= this.state.viewport_bounds.south &&
          this.state.active_vehicles[i]['Latitude'] <= this.state.viewport_bounds.north &&
          this.state.active_vehicles[i]['Longitude'] >= this.state.viewport_bounds.west &&
          this.state.active_vehicles[i]['Longitude'] <= this.state.viewport_bounds.east
          ) {
          markers.push(
          <Marker key={i} latitude={this.state.active_vehicles[i]['Latitude']} longitude={this.state.active_vehicles[i]['Longitude']} offsetLeft={-4} offsetTop={-4}>
            <div className={'location-marker ' + this.state.marker_size}></div>
          </Marker>
          )
        }
      }
      return markers
    }
  }

  render() {
    return (
      <ReactMapGL
        // mapbox API access token
        mapboxApiAccessToken={MAPBOX_TOKEN}
        // mapbox styling/theme
        mapStyle='mapbox://styles/mapbox/dark-v9'
        ref={ map => this.mapRef = map }
        {...this.state.viewport}
        onViewportChange={this._onViewportChange}>

        <div>
          {this.createMarkers()}
        </div>

      </ReactMapGL>
    );
  }

  componentDidMount() {
    // store map and its viewport bounds
    myMap = this.mapRef.getMap();
    this.updateViewportBounds();
    // initial fetch
    this.fetchLocation();
    // fetch at defined interval
    this.interval = setInterval(() => this.fetchLocation(), FETCH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

}

export default Mapbox;