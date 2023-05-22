import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  multipleFileUpload,
  setLocation,
} from "Redux/Actions/commonCRUD";
import GpxMap from "../Map";
import "./style.scss";
import Loader from "react-loader-spinner";

function MultipleFileUploader({
  name,
  id,
  defaultvalue = "",
  label,
  setFieldValue = () => { },
  placeholder,
  showmap,
  fileName,
  showImage = undefined,
  ImageUrl = undefined,
  clickHandler,
  ...props
}) {
  const [file, setFile] = useState("");
  const [modalOpen, setmodalOpen] = useState(false);
  const [coordinates_arr, setCoordinates] = useState([]);
  const [prevUrl, setprevUrl] = useState(defaultvalue);
  const places = useSelector((state) => state.location.coordinates) || [];
  const [filesUrl, setFileUrl] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  var points = coordinates_arr?.map((value) =>
    Object.assign({}, { lat: value.lat, lng: value.lng })
  );

  const [mapState, setMapState] = useState(false);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const [error,setError]=useState(null);

  const toggleModalView = () => {
    setmodalOpen((modalOpen) => !modalOpen);
  };

  useEffect(() => {
    setFieldValue("Map", filesUrl);
  }, [filesUrl]);

  const [showLoader, setLoader] = useState(false);
  const [gpxFiles, setGpxFiles] = useState([]);

  useEffect(() => {
    for (let i = 0; i < files.length; i++) {
      setGpxFiles((value) => [...value, files[i]])
    }
  }, [files]);

  useEffect(() => {
    dispatch(setLocation(coordinates_arr));
  }, [coordinates_arr]);
  
 

  const submitHandler = () => {
    if(fileCount===0){
      setError(true);
    }
    if (fileCount) {
      setLoader(true);
      dispatch(
        multipleFileUpload(
          {
            file: gpxFiles
          },
          (fileUrl) => {
            setFileUrl(fileUrl?.data?.fileUrls);
            setCoordinates(() => {
              return fileUrl?.data?.parseData;
            });
            setMapState(true);
            setLoader(false);
            clickHandler();
          }
        )
      );
    }

  };

  return (
    <>
      <div className="input_file">
        <input
          multiple
          label={label}
          type="file"
          accept=".gpx"
          name={name}
          id={id}
          className="form-control "
          placeholder={placeholder}
          showmap={showmap}
          onChange={(e) => {
            setFiles(e?.target?.files);
            setFileCount(e?.target?.files?.length);
          }}
        />
        <label>Upload file</label>
        {fileCount ? <legend>{`${fileCount} files`}</legend> : null}
      </div>
      {
        error?<span className="error">This is a required field</span>: null
      }
      <br />
      {!showLoader ? (
        <button
          className="btn btn-md btn-secondary m-1"
          type="button"
          onClick={() => {
            submitHandler();
          }}
        >
          Upload Files
        </button>
      ) : (
        <Loader
          className="loader_class"
          type="Bars"
          color="#13651B"
          height={70}
          width={70}
          secondaryColor="grey"
          visible={true}
        />
      )}
      {coordinates_arr?.length && showmap ? <GpxMap points={points} /> : null}



    </>
  );
}

export default MultipleFileUploader;
