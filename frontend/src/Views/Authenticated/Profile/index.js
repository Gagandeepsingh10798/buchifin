import File_Field from "Components/atoms/FileField";
import CustomModal from "Components/atoms/Modal";
import ServerImage from "Components/atoms/Server_Image";
import TextField from "Components/atoms/TextField";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  deleteProfiles,
  getProfiles,
  postProfiles,
} from "Redux/Actions/commonCRUD";
import { ICONS, STRINGS, titleCase } from "Shared";
import { ROUTE_CONSTANTS } from "Shared";
import { withSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

function Profile(props) {
  const [showEditModal, setModalView] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setmodalOpen] = useState(false);
  const history = useHistory();
  const currentItems = [];
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.profiles);

  const toggleModalView = () => {
    setmodalOpen((modalOpen) => !modalOpen);
  };

  const modalHandler = () => {
    setModalView(false);
    toggleModalView();
  };

  const submitHandler = (data) => { 
    let values = {
      name: data[STRINGS.PROFILE_NAME],
      image: data[STRINGS.PROFILE_IMAGE],
    };
    dispatch(
      postProfiles(values, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        if (type == "success") {
          setModalView(true);
          toggleModalView();
          dispatch(getProfiles());
        }
      })
    );
  };

  const deleteHandler = (id) => {
    dispatch(
      deleteProfiles(id, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        if (type == "success") {
          dispatch(getProfiles());
        }
      })
    );
  };

  useEffect(() => {
    dispatch(getProfiles());
  }, []);

  return (
    <>
      <CustomModal isOpen={modalOpen} handleToggle={toggleModalView}>
        <Formik onSubmit={submitHandler} initialValues={{}}>
          {(props) => (
            <Form>
              <div className="modal-header justify-content-center">
                <h3 className="h4">Add New Profile</h3>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    {/* <label>Name</label> */}
                    <div className="form-group">
                      <TextField
                        label={STRINGS.NAME}
                        name={STRINGS.PROFILE_NAME}
                        type="text"
                        className="form-control"
                      />
                      {error ? (
                        <span className="error">This is a required field</span>
                      ) : null}
                    </div>
                    <label>Image</label>
                    <File_Field
                      name={STRINGS.PROFILE_IMAGE}
                      setFieldValue={props.setFieldValue}
                      id="trail"
                      showmap={false}
                      fileName="Profile"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-md btn-cancel" onClick={()=>toggleModalView()}>
                  Cancel
                </button>
                <button className="btn btn-md btn-primary" type="submit">
                  Add
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
      <>
        <div className="d-flex justify-content-between flex-wrap w-100 page-title">
          <h4 className="h4">Profile</h4>

          <div className="col_rht">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => modalHandler()}
            >
              Add Profile
            </button>
          </div>
        </div>

        <div className="row trail_list">
          {profiles?.map((value, index) => (
            <div
              className="col-xl-3 col-md-4 col-sm-6"
              //   onClick={() => clickHandler(value._id)}
            >
              <div className="trail_items">
                <figure>
                  <ServerImage
                    url={value.image}
                    width="230px"
                    height="200px"
                    className="img-fluid"
                  />
                </figure>
                <div className="trail_summary">
                  <h6>{titleCase(value.name)}</h6>
                </div>
                <div class="delete-pic">
                  <button class="btn" onClick={() => deleteHandler(value._id)}>
                    <img src={ICONS.RemoveIcon} alt="Remove Icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    </>
  );
}

export default withSnackbar(Profile);
