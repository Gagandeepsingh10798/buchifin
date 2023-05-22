import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  DirectionsRenderer,
  Polyline
} from "react-google-maps";

class MapDirectionsRenderer extends React.Component {
  state = {
    directions: null,
    error: null
  };

  componentDidMount() {
    const { places, travelMode } = this.props;
    // console.log(places,"places in did mount")
    let waypoints = places.map(p =>
        {
            return {
                location: {lat: p.latitude, lng:p.longitude},
                stopover: false
            }
    });
    
    console.log(waypoints.map((value)=>value.location))
    const origin = [...waypoints].shift().location;
    const destination = [...waypoints].pop().location;
    const directionsService = new window.google.maps.DirectionsService();
    // const directionsDisplay = new window.google.maps.DirectionsRenderer({suppressMarkers: true});
    
  

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
        
      },
      (result, status) => {
          
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
        

        }
      }
    );
  }

  render() {
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
    return (this.state.directions && <DirectionsRenderer directions={this.state.directions} />)
  }
}



  
const Map = withScriptjs(
  withGoogleMap(props => 
    (
        
    <GoogleMap
      defaultCenter={props.defaultCenter}
      defaultZoom={props.defaultZoom}
    >
      {props.markers.map((marker, index) => {
        const position = { lat: marker.latitude, lng: marker.longitude };
        return <Marker key={index} position={position} />;
      })}
      {/* <Polyline path={props.marker} options={props.options}  /> */}
      <MapDirectionsRenderer
        places={props.markers}
        travelMode={window.google.maps.TravelMode.DRIVING}
      />
    </GoogleMap>
  ))
);

export default Map;