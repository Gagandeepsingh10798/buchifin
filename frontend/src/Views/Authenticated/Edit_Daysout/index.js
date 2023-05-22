import File_Field from "Components/atoms/FileField";
import TextField from "Components/atoms/TextField";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfiles,
  postDaysOut,
  updateDaysOut,
} from "Redux/Actions/commonCRUD";
import {
  LABELS,
  PLACEHOLDERS,
  ROUTE_CONSTANTS,
  STRINGS,
  titleCase,
} from "Shared";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Multi_Select_Dropdown from "Components/atoms/Multi_Select_Dropdown";
import { ContactSupportOutlined } from "@material-ui/icons";

function Edit_Days_Out(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const current_daysOut = useSelector(
    (state) => state.currentDaysOut.currentDaysOut[0]
  );
  const [profiles, setProfiles] = useState([]);
  const profileType = useSelector((state) => state?.profiles?.profiles);

  const submitHandler = (val) => {
    let data = {
      id: current_daysOut?._id,
      name: val.Name,
      image: val[STRINGS.FACILITIES_IMAGE],
      webLink: val.Website,
      profileType: current_Profiles?.map((value)=>value?.value)
    };


    dispatch(
      updateDaysOut(data, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        if (type == "success") {
          history.push(ROUTE_CONSTANTS.DAYS_OUT_HOME);
        }
      })
    );
  };
  const current_Profile_Type = profileType.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "50%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value?._id,
      }
    )
  );

  console.log(current_daysOut.profileType)

  const [current_Profiles, setCurrentProfiles] = useState(
    current_daysOut?.profileType?.map((value) =>
      Object.assign(
        {},
        {
          label: (
            <div>
              <img
                src={`https://${value?.image}`}
                height="30px"
                width="30px"
                style={{ borderRadius: "50%" }}
              />
              &nbsp;&nbsp;{value?.name}
            </div>
          ),
          value: value?._id,
        }
      )
    )
  );

  useEffect(() => {
    dispatch(getProfiles());
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap w-100 page-title">
        <h4 className="h4">Edit Daysout</h4>
      </div>
      <div>
        <Formik
          onSubmit={submitHandler}
          initialValues={{
            [STRINGS.NAME]: titleCase(current_daysOut?.name),
            [STRINGS.WEBSITE]: current_daysOut?.webLink,
            [STRINGS.FACILITIES_IMAGE]: current_daysOut?.image,
            [STRINGS.PROFILES]: current_Profiles,
          }}
        >
          {(props) => (
            <Form>
              <div className="form-group">
                <label>Image</label>
                <File_Field
                  name={STRINGS.FACILITIES_IMAGE}
                  placeholder=""
                  label="Upload Image"
                  setFieldValue={props.setFieldValue}
                  id="daysout"
                  ImageUrl={current_daysOut?.image}
                />
              </div>
              <div className="form-group">
                <TextField
                  label={LABELS.NAME}
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  name={STRINGS.NAME}
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>Profile Type</label>
                <Multi_Select_Dropdown
                  name={STRINGS.PROFILES}
                  defaultValue={current_Profiles}
                  options={current_Profile_Type}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  allowSelectAll={true}
                  changeHandler={(e) => {
                    setCurrentProfiles(e);
                    props.setFieldValue(STRINGS.PROFILES, e);
                  }}
                />
              </div>
              <div className="form-group">
                <TextField
                  label={LABELS.WEBSITE}
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  name={STRINGS.WEBSITE}
                  type="text"
                />
              </div>
              <button type="submit" className="btn btn-md btn-primary">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default withSnackbar(Edit_Days_Out);
