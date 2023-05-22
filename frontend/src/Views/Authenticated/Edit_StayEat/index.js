import { Form_Strings, LABELS, PLACEHOLDERS, REGEX, ROUTE_CONSTANTS, STRINGS } from "Shared";
import { useDispatch, useSelector } from "react-redux";
import { titleCase } from "Shared";
import * as Yup from "yup";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router";
import Multi_Select_Dropdown from "Components/atoms/Multi_Select_Dropdown";
import TextField from "Components/atoms/TextField";
import { Form, Formik } from "formik";
import File_Field from "Components/atoms/FileField";
import { getStayHome, updateStayEat } from "Redux/Actions/commonCRUD";

function Edit_Stay_Eat(props) {
  const current_StayEat = useSelector(
    (state) => state.currentStayEat.currentStayEat
  );
  const trails=useSelector((state)=>state.trails.trails);
  const history = useHistory();
  const dispatch=useDispatch();
  const allTrails=trails.map((value)=>Object.assign({},{label: value.trailName, value: value._id}))
  const currentTrails=current_StayEat.trail?.map((value)=>Object.assign({},{label: value?.trailName, value : value?._id}))
  const submitHandler=(data)=>{
    
      let formData={
        id: current_StayEat?._id,
        name: data[Form_Strings.NAME],
        description: data[Form_Strings.DESCRIPTION],
        trail:data[Form_Strings.TRAIL].map((value)=>value.value),
        imageUrl: data[STRINGS.STAY_EAT_IMAGE],
        address: data[Form_Strings.ADDRESS],
        email: data[Form_Strings.EMAIL],
        contactNumber: data[Form_Strings.PHONE_NUMBER],
        webLink: data[Form_Strings.WEBSITE]
      }
        dispatch(updateStayEat(formData,(message, type) => {

          props.enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            }
          });
          if(type=="success"){
            history.push(ROUTE_CONSTANTS.STAY_HOME);
            dispatch(getStayHome());
          }
        }))
  }

  const validationSchema = Yup.object({
    [STRINGS.NAME]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.ADDRESS]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(80, "Maximum Length is 40"),
    [STRINGS.DESCRIPTION]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field"),
    [STRINGS.PHONE_NUMBER]: Yup.string()
      .required(STRINGS.PHONE_EMPTY)
      .matches(REGEX.PHONE, STRINGS.PHONE_ERROR),
    [STRINGS.EMAIL]: Yup.string()
      .required(STRINGS.EMAIL_EMPTY)
      .email(STRINGS.EMAIL_ERROR),
    Trail: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    [STRINGS.STAY_EAT_IMAGE]: Yup.string().required(STRINGS.EMPTY_FIELD),
  });

  return (
    <>
      <Formik
        onSubmit={submitHandler}
        initialValues={{
          [STRINGS.NAME]: titleCase(current_StayEat?.name),
          [STRINGS.ADDRESS]: titleCase(current_StayEat?.address),
          [STRINGS.DESCRIPTION]: titleCase(current_StayEat?.description),
          [STRINGS.PHONE_NUMBER]: current_StayEat?.contactNumber,
          [STRINGS.EMAIL]: current_StayEat?.email,
          [STRINGS.TRAIL]: currentTrails,
          [STRINGS.STAY_EAT_IMAGE]: current_StayEat?.imageUrl,
          [STRINGS.WEBSITE]:current_StayEat?.webLink
        }}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <div className="d-flex justify-content-between flex-wrap w-100 page-title">
              <h4 className="h4">Edit Stay Eat</h4>
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
              <label>Image</label>
              <File_Field
                name={STRINGS.STAY_EAT_IMAGE}
                placeholder=""
                label="Upload Image"
                setFieldValue={props.setFieldValue}
                id="hotel"
                fileName="Hotel"
                ImageUrl={current_StayEat?.imageUrl}
              />
            </div>
            <div className="form-group">
              <label>Select Trail</label>
              <Multi_Select_Dropdown
                name="Trail"
                defaultValue={currentTrails}
                options={allTrails}
                placeholder={PLACEHOLDERS.SELECT}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                allowSelectAll={true}
                changeHandler={(e) => {
                  props.setFieldValue("Trail", e);
                }}
              />
            </div>
            <div className="form-group">
              <TextField
                label={LABELS.ADDRESS}
                placeholder={PLACEHOLDERS.WRITE_HERE}
                name={STRINGS.ADDRESS}
                type="text"
              />
            </div>
            <div className="form-group">
              <TextField
                label={LABELS.DESCRIPTION}
                placeholder={PLACEHOLDERS.WRITE_HERE}
                name={STRINGS.DESCRIPTION}
                type="text"
              />
            </div>
            <div className="form-group">
              <TextField
                label={LABELS.PHONE_NUMBER}
                placeholder={PLACEHOLDERS.WRITE_HERE}
                name={STRINGS.PHONE_NUMBER}
                type="tel"
              />
            </div>
            <div className="form-group">
              <TextField
                label={LABELS.EMAIL}
                placeholder={PLACEHOLDERS.WRITE_HERE}
                name={STRINGS.EMAIL}
                type="text"
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
            <div className="btn_group pb-3">
              <button
                className="btn btn-md btn-cancel m-1"
                type="button"
                onClick={() => history.push(ROUTE_CONSTANTS.STAY_HOME)}
              >
                Cancel
              </button>
              <button className="btn btn-md btn-primary m-1" type="submit">
                Update
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default withSnackbar(Edit_Stay_Eat);
