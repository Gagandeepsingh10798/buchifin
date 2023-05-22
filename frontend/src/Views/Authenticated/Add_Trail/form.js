import * as Yup from "yup";
import TextField from "Components/atoms/TextField";
import { STRINGS, Form_Strings, LABELS, PLACEHOLDERS } from "Shared/Constants";
import { Form, Formik, useFormikContext } from "formik";
import { useHistory } from "react-router-dom";
import { ROUTE_CONSTANTS } from "Shared/Routes";
import File_Field from "Components/atoms/FileField";
import { useSelector } from "react-redux";
import { useState } from "react";
import { withSnackbar } from "notistack";
import CustomModal from "Components/atoms/Modal";
import Dropdown from "Components/atoms/Dropdown";
import { FIRM_TYPE_OPTIONS } from "Shared";

function Add_Trail(props) {
  const [modalOpen, setmodalOpen] = useState(false);
  const history = useHistory();
  const [showDetails, setShowDetails] = useState(false);
  const [firmType,setFirmType]=useState(Form_Strings.PROPRIETORSHIP)

  const validationSchema = Yup.object({
    [STRINGS.TRAIL_NAME]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.STATE]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.TRAIL_CITY]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.ADDRESS]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 40"),
    [STRINGS.DESCRIPTION]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field"),
    [STRINGS.TRAIL_LENGTH]: Yup.number()
      .positive("Length can't be a negative value")
      .required("Trail Length is a required field")
      .max(99, "Trail length should be less than 100 Km")
      .positive(),
    [STRINGS.MINIMUM_TIME]: Yup.string().required(STRINGS.EMPTY_FIELD),
    [STRINGS.MAXIMUM_TIME]: Yup.string().required(STRINGS.EMPTY_FIELD),
    [STRINGS.TRAIL_IMAGE]: Yup.string().required(STRINGS.EMPTY_FIELD),
    [STRINGS.TERRAIN_TYPE]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.TRAIL_START_POINT]: Yup.string()
      .required(STRINGS.EMPTY_FIELD)
      .max(25, "Maximum 25 characters are allowed"),
    [STRINGS.NEAREST_TOWN]: Yup.string()
      .required(STRINGS.EMPTY_FIELD)
      .max(25, "Maximum 25 characters are allowed"),
    profiles: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Equipments: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Trail_Type: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Trail_Suitability: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Trail_Category: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Difficulty_Level: Yup.object().required(STRINGS.EMPTY_FIELD).nullable(),
    Country: Yup.object().required(STRINGS.EMPTY_FIELD).nullable(),
  });

  const submithandler = (data) => {
    console.log(data);
  };

  const switchFirmForms=(type)=>{
    switch(type){
      case Form_Strings.PROPRIETORSHIP:
          return (  
            <>
          <div className="col-md-4">
          <div className="form-group">
            <TextField
              label={Form_Strings.LICENSE_NUMBER}
              placeholder={Form_Strings.LICENSE_NUMBER}
              name={Form_Strings.LICENSE_NUMBER}
              type="text"
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <TextField
              label={Form_Strings.AADHAR_CARD}
              placeholder={Form_Strings.AADHAR_CARD}
              name={Form_Strings.AADHAR_CARD}
              type="text"
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <TextField
              label={Form_Strings.PAN_CARD}
              placeholder={Form_Strings.PAN_CARD}
              name={Form_Strings.PAN_CARD}
              type="text"
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label>Aadhar Card</label>
            <File_Field
              name={Form_Strings.AADHAR_CARD}
              placeholder=""
              label="Upload Trail Image"
              setFieldValue={props.setFieldValue}
              id="trail"
              showmap={false}
              fileName="Trail"
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label>PAN Card</label>
            <File_Field
              name={Form_Strings.PAN_CARD}
              placeholder=""
              label="Upload Trail Image"
              setFieldValue={props.setFieldValue}
              id="trail"
              showmap={false}
              fileName="Trail"
            />
          </div>
        </div>
        </>
        )

        case Form_Strings.PRIVATE_LIMITED: 

        return (  
          <>
        <div className="col-md-4">
        <div className="form-group">
          <TextField
            label={Form_Strings.LICENSE_NUMBER}
            placeholder={Form_Strings.LICENSE_NUMBER}
            name={Form_Strings.LICENSE_NUMBER}
            type="text"
          />
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <TextField
            label={Form_Strings.PAN_CARD}
            placeholder={Form_Strings.PAN_CARD}
            name={Form_Strings.PAN_CARD}
            type="text"
          />
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-group">
          <label>PAN Card</label>
          <File_Field
            name={Form_Strings.PAN_CARD}
            placeholder=""
            label="Upload Trail Image"
            setFieldValue={props.setFieldValue}
            id="trail"
            showmap={false}
            fileName="Trail"
          />
        </div>
      </div>
      </>
      )


      
  }
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap w-100 page-title">
        <h4 className="h4">Add Retailers</h4>
      </div>

      <div className="form_sec">
        <Formik
          onSubmit={submithandler}
          initialValues={{
            [STRINGS.TRAIL_NAME]: STRINGS.EMPTY_STRING,
            [STRINGS.STATE]: STRINGS.EMPTY_STRING,
            [STRINGS.TRAIL_CITY]: STRINGS.EMPTY_STRING,
            [STRINGS.ADDRESS]: STRINGS.EMPTY_STRING,
            [STRINGS.DESCRIPTION]: STRINGS.EMPTY_STRING,
            [STRINGS.TRAIL_LENGTH]: STRINGS.EMPTY_STRING,
            [STRINGS.MINIMUM_TIME]: STRINGS.EMPTY_STRING,
            [STRINGS.MAXIMUM_TIME]: STRINGS.EMPTY_STRING,
            [STRINGS.TRAIL_IMAGE]: STRINGS.EMPTY_STRING,
            [STRINGS.TRAIL_START_POINT]: STRINGS.EMPTY_STRING,
            [STRINGS.NEAREST_TOWN]: STRINGS.EMPTY_STRING,
            [STRINGS.TERRAIN_TYPE]: STRINGS.EMPTY_STRING,
            profiles: STRINGS.EMPTY_STRING,
            Equipments: STRINGS.EMPTY_STRING,
            Trail_Type: STRINGS.EMPTY_STRING,
            Trail_Suitability: STRINGS.EMPTY_STRING,
            Trail_Category: STRINGS.EMPTY_STRING,
            Difficulty_Level: STRINGS.EMPTY_STRING,
            Country: STRINGS.EMPTY_STRING,
          }}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
              <CustomModal
                isOpen={modalOpen}
                // handleToggle={toggleModalView}
              >
                <>
                  <div className="modal-header justify-content-center">
                    <h3>Edit Facilities</h3>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label>Upload Image</label>
                          <File_Field
                            name={STRINGS.FACILITIES_IMAGE}
                            placeholder=""
                            setFieldValue={
                              (STRINGS.FACILITIES_IMAGE, props.setFieldValue)
                            }
                            id="trail"
                            showmap={false}
                            showImage={false}
                            ImageUrl={props?.values?.[STRINGS.FACILITIES_IMAGE]}
                          />
                        </div>

                        <div className="form-group">
                          <TextField
                            label={STRINGS.NAME}
                            placeholder={PLACEHOLDERS.WRITE_HERE}
                            name={STRINGS.FACILITIES}
                            type="text"
                          />
                        </div>

                        <div className="form-group">
                          <TextField
                            label={STRINGS.DISTANCE}
                            placeholder={PLACEHOLDERS.WRITE_HERE}
                            name={STRINGS.FACILITIES_DISTANCE}
                            type="text"
                          />
                        </div>

                        {showDetails ? (
                          <>
                            <div className="form-group">
                              <TextField
                                label={STRINGS.FACILITIES_OPEN_TIME}
                                placeholder={STRINGS.EMPTY_STRING}
                                name={STRINGS.FACILITIES_OPEN_TIME}
                                type="time"
                              />
                            </div>

                            <div className="form-group">
                              <TextField
                                label={STRINGS.FACILITIES_CLOSE_TIME}
                                placeholder={PLACEHOLDERS.WRITE_HERE}
                                name={STRINGS.FACILITIES_CLOSE_TIME}
                                type="time"
                              />
                            </div>
                          </>
                        ) : null}
                        <div></div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer justify-content-center">
                    <button type="button" className="btn btn-md btn-primary">
                      Update
                    </button>
                  </div>
                </>
              </CustomModal>

              <div className="form-row"></div>

              <fieldset>
                <legend>Retailer Info</legend>
                <div className="form-row">
                  <div className="col-md-4">
                    
                    <div className="form-group">
                      <label>Profile Picture</label>
                      <File_Field
                        name={STRINGS.TRAIL_IMAGE}
                        placeholder=""
                        label="Upload Trail Image"
                        setFieldValue={props.setFieldValue}
                        id="trail"
                        showmap={false}
                        fileName="Trail"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.FIRST_NAME}
                        placeholder={Form_Strings.FIRST_NAME}
                        name={Form_Strings.FIRST_NAME}
                        type="text"
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-4">
                    <div className="form-group">
                      <label>Country</label>
                      <Dropdown
                        defaultValue={""}
                        label={LABELS.COUNTRY}
                        // options={countries?.map((t) => ({
                        //   value: t.isoCode,
                        //   label: t.name,
                        // }))}
                        className=""
                        isSearchable={true}
                        placeholder={PLACEHOLDERS.SELECT}
                        isClearable={true}
                        name="Country"
                        // changeHandler={(e) => {
                        //   changeHandler(e);
                        //   props.setFieldValue("Country", e);
                        // }}
                      />
                    </div>
                  </div> */}

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.LAST_NAME}
                        placeholder={LABELS.LAST_NAME}
                        name={LABELS.LAST_NAME}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.EMAIL}
                        placeholder={PLACEHOLDERS.EMAIL}
                        name={STRINGS.EMAIL}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.PHONE_NUMBER}
                        placeholder={LABELS.PHONE_NUMBER}
                        name={STRINGS.PHONE_NUMBER}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={PLACEHOLDERS.ADDRESS}
                        placeholder={PLACEHOLDERS.ADDRESS}
                        name={STRINGS.ADDRESS}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.PASSWORD}
                        placeholder={PLACEHOLDERS.PASSWORD}
                        name={STRINGS.PASSWORD}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="col-md-6">
                    <div className="form-group">
                      <label>Firm Type</label>
                      <Dropdown
                        name="Firm Type"
                        options={FIRM_TYPE_OPTIONS}
                        defaultValue={FIRM_TYPE_OPTIONS[0]}
                        changeHandler={(e)=>setFirmType(e.value)}
                      />
                    </div>
                  </div>

              <fieldset>
                <legend>Firm Info</legend>
                 

                  <div className="form-row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={Form_Strings.FIRM_NAME}
                        placeholder={Form_Strings.FIRM_NAME}
                        name={Form_Strings.FIRM_NAME}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={Form_Strings.GST_NO}
                        placeholder={Form_Strings.GST_NO}
                        name={Form_Strings.GST_NO}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>GST Document</label>
                      <File_Field
                        name={Form_Strings.GST_DOCUMENT}
                        placeholder=""
                        label="Upload Trail Image"
                        setFieldValue={props.setFieldValue}
                        id="trail"
                        showmap={false}
                        fileName="Trail"
                      />
                    </div>
                  </div>
                
                {switchFirmForms(firmType)}
                
                </div>
              </fieldset>

              <div className="btn_group pb-3">
                <button
                  className="btn btn-md btn-cancel m-1"
                  type="button"
                  onClick={() => history.push(ROUTE_CONSTANTS.ADMIN_TRAILS)}
                >
                  Cancel
                </button>
                <button className="btn btn-md btn-primary m-1" type="submit">
                  Add Retailer
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default withSnackbar(Add_Trail);
