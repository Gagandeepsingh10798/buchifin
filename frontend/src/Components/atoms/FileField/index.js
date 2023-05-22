import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD_FILE } from "Redux/Actions/ActionType";
import { uploadfile } from "Redux/Actions/commonCRUD";
import { coordinates, IMAGES, STRINGS } from "Shared";
import GpxMap from "../Map";
import CustomModal from "../Modal";
import imageCompression from "browser-image-compression";
import "./style.scss";
import ServerImage from "../Server_Image";
import { ContactSupportOutlined } from "@material-ui/icons";
import ImageDropdown from "../ImageDropdown";
import { ErrorMessage, useField } from "formik";
import ImageReducer from "Redux/Reducers/ImagesReducer";

function File_Field({
  id,
  defaultvalue = "",
  label,
  setFieldValue = () => {},
  placeholder,
  submitHandler,
  showmap,
  fileName,
  showImage = undefined,
  ImageUrl = undefined,
  showmapIcon = undefined,
  format = ".png, .jpg, .jpeg",
  clickHandler,
  ...props
}) {
  const [file, setFile] = useState("");
  const [modalOpen, setmodalOpen] = useState(false);
  const [coordinates_arr, setCoordinates] = useState([]);
  const [prevUrl, setprevUrl] = useState(defaultvalue);
  const places = useSelector((state) => state.location.coordinates) || [];
  // let points = places?.map((value) =>
  //   Object.assign({}, { lat: value.lat, lng: value.lng })
  // );

  useEffect(() => {
    for (let i = 0; i < places.length; i += 26) {
      coordinates_arr.push(places[i]);
    }
  }, [places?.length]);

  const dispatch = useDispatch();
  const toggleModalView = () => {
    setmodalOpen((modalOpen) => !modalOpen);
  };
  var options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const [showEditModal, setModalView] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [field, meta] = useField({ ...props, name: props?.name ?? "" });

  return (
    <>
      <div className="input_file">
        <input
          label={label}
          type="file"
          accept="*"
          name={props.name}
          id={id}
          className="form-control "
          placeholder={placeholder}
          showmap={showmap}
          showmapIcon={showmapIcon}
          onChange={(e) => {
            let file = e.target.files[0];
            let fileUrl = "";

            if (file && !(id == "location")) {
              fileUrl = URL.createObjectURL(file);

              setImageUrl(fileUrl);
              imageCompression(file, options)
                .then(function (compressedFile) {
                  if (e.target.files[0]) {
                    dispatch(
                      uploadfile(
                        {
                          file: compressedFile,
                          id,
                        },
                        (fileUrl) => {
                          if (fileName == "Garages") {
                            setFieldValue(props.name, fileUrl);
                          } else if (fileName == "Profile") {
                            setFieldValue(props.name, fileUrl);
                          } else if (fileName == "Repair") {
                            setFieldValue(props.name, fileUrl);
                          } else if (fileName == "Transport") {
                            setFieldValue(props.name, fileUrl);
                          } else if (fileName == "Places") {
                            setFieldValue("Places", fileUrl);
                          } else if (fileName == "Trail")
                            setFieldValue(props.name, fileUrl);
                          else if (fileName == "Hotel")
                            setFieldValue(props.name, fileUrl);
                          else {
                            setFieldValue(STRINGS.FACILITIES_IMAGE, fileUrl);
                          }
                        }
                      )
                    );
                  }
                })
                .catch(function (error) {
                  alert(error.message);
                });

              setFile(fileUrl);
              setprevUrl("");
            } else {
              if (URL) {
                fileUrl = URL?.createObjectURL(file);
              }

              if (e.target.files[0]) {
                dispatch(
                  uploadfile(
                    {
                      file: e.target.files[0],
                      id,
                    },
                    (fileUrl) => {
                      if (id == "location") {
                        setFieldValue("Map", fileUrl);
                      }
                    }
                  )
                );
              }
            }
          }}
        />
        <label>Upload file</label>

        {prevUrl && showImage
          ? null
          : file && (
              <div className="file_pic">
                <img src={file} width="40px" height="40px" alt="" />
              </div>
            )}
        {!showImage ? (
          <div className="file_pic">
            <ServerImage
              defaultSrc={imageUrl}
              url={ImageUrl}
              width="40px"
              height="40px"
              alt="No Image"
            />
          </div>
        ) : null}
        {/* {coordinates_arr?.length && showmap ? <GpxMap points={points} /> : null} */}
      </div>
      <div className="error">
        <ErrorMessage name={field.name} />
      </div>
    </>
  );
}

export default File_Field;
