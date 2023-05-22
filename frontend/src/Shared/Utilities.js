import { Form_Strings } from "./Constants";

export const UTILITIES = {};

export const titleCase = (string) => {
    
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

export const Capitalize=(input)=> {  
    if(input){
    var words = input?.split(' ');  
    var CapitalizedWords = [];  
    words?.forEach(element => {  
        if(element)
        CapitalizedWords?.push(element[0]?.toUpperCase() + element?.slice(1, element?.length));  
    });  
    return CapitalizedWords.join(' ');  
}}


export const FIRM_TYPE_OPTIONS=[
    { label: Form_Strings.PROPRIETORSHIP, value: Form_Strings.PROPRIETORSHIP },
    {
      label: Form_Strings.PRIVATE_LIMITED,
      value: Form_Strings.PRIVATE_LIMITED,
    },
    {
      label: Form_Strings.PARTNERSHIP,
      value: Form_Strings.PARTNERSHIP,
    },
  ]

// import { MapContainer } from "react-leaflet";
// import 'leaflet/dist/leaflet.css'
// import { TileLayer } from "react-leaflet";
// import { CircleMarker } from "react-leaflet";
// import { Polyline } from "react-leaflet";
// import "./style.css"
// import { positions } from "Shared";


// const GpxMap = () => {
//   return (
//     <div >
//       <MapContainer center={positions[0]} zoom={12} scrollWheelZoom={true}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <CircleMarker
//           center={positions[0]}
//           position={positions[0]}
//           radius={10}
//           pathOptions={{ color: "black" }}
//         />
//         <CircleMarker
//           center={positions[0]}
//           position={positions[1332]}
//           radius={20}
//           pathOptions={{ color: "green" }}
//         />
//         <Polyline
//           pathOptions={{ fillColor: "red", color: "blue" }}
//           positions={[positions]}
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default GpxMap;

