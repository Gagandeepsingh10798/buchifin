import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMultipleImages } from "Redux/Actions/Auth";
import { uploadfile, uploadMultipleImages } from "Redux/Actions/commonCRUD";
import Loader from "react-loader-spinner";

function MultipleImageUploader({
  name,
  id,
  defaultvalue = "",
  label,
  setFieldValue = () => {},
  placeholder,
  showmap,
  fileName,
  showImage = undefined,
  ImageUrl = undefined,
  clickHandler,
  images,
  ...props
}) {
  const dispatch = useDispatch();
  const [currentImages, setCurrentImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);
  const trailData = useSelector((state) => state.current_trail.current_trail);
  const [showLoader, setLoader] = useState(false);
  const fetchImage = () => {
    if (images?.length) {
      images.map((value) =>
        dispatch(
          uploadfile(
            {
              file: value.file,
              id,
            },
            (fileUrl) => {
              setCurrentImages((state) => [...state, fileUrl]);
            }
          )
        )
      );
    }
  };

  const submitHandler = () => {
    if (files?.length) {
      files.forEach((value) =>
        dispatch(
          uploadfile({ file: value, id }, (fileUrl) =>
            setFileUrl((value) => [...value, fileUrl])
          )
        )
      );
    }
  };

  

  useEffect(() => {
    if (files?.length && fileUrl?.length) {
      if (fileUrl?.length === files?.length) {
        let data = {
          trailId: trailData._id,
          imageUrl: fileUrl,
        };
        console.log(data)
        dispatch(
          uploadMultipleImages(data, (message, type) => {
            clickHandler(message, type);
          
          })
        );
      }
    }
  }, [fileUrl]);

  useEffect(() => {
    fetchImage();
  }, [images]);

  // useEffect(() => {
  //   dispatch(setMultipleImages(currentImages));
  // }, [currentImages]);

  return (
    <>
      <div className="input_file">
        <input
          multiple
          label={label}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          name={name}
          id={id}
          className="form-control "
          placeholder={placeholder}
          showmap={showmap}
          onChange={(e) => {
            setFiles(e?.target?.files);
          }}
        />
        <label>Upload file</label>
        {/* {fileCount ? <legend>{`${fileCount} files`}</legend> : null} */}
      </div>
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
    </>
  );
}

export default MultipleImageUploader;
