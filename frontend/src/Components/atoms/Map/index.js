import { NavigateBeforeSharp } from "@material-ui/icons";
import "./style.css";
function GpxMap({points}) {

  let center=parseInt(points?.length/2);
  

  const map = new window.google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: points[center],
    mapTypeId: "terrain",
  });

  const flightPlanCoordinates = points;

  const flightPath = new window.google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#13651B",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  new window.google.maps.Marker({
    position: flightPlanCoordinates[0],
    label:"A",
    map,
  });


  new window.google.maps.Marker({
    position: flightPlanCoordinates[flightPlanCoordinates.length - 1],
    label:"B",
    map,
  });
 

  flightPath.setMap(map);
  return (
    <>
    </>
  )
}

export default GpxMap;
