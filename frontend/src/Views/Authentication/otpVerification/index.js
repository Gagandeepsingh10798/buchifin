import FormikForm from "Components/atoms/Formik";
import { useState } from "react";
import { LABELS, PLACEHOLDERS, ROUTE_CONSTANTS, STRINGS } from "Shared";
import * as Yup from "yup";
import TextField from "Components/atoms/TextField";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "Redux/Actions/Auth";
import { useHistory } from "react-router";
import { withSnackbar } from "notistack";
import { IMAGES } from "Shared";

function OTP_Verification(props) {

  const currentEmail=useSelector((state)=>state.email.email);
  const dispatch=useDispatch();
  const history=useHistory();
  const submitHandler = (val) => {  
    let data={
        email:currentEmail?.email,
        code:val?.OTP,
    }
    history.push(ROUTE_CONSTANTS.RESET_PASSWORD);
  };

  
  const validationHandler = Yup.object({
    [STRINGS.OTP]: Yup.number()
      // .positive("OTP can't be a negative value")
      // .required("This is a required field")
      // .test('len', 'Must be exactly 4 characters', val => {val = val+""; return val?.length === 4})
  });

  const resendHandler=()=>{
    let data={
      email:currentEmail.email
    }
    
    dispatch(resendOtp(data,(message, type) => {             
      props.enqueueSnackbar(message, {
        variant: type,
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });

     }))
  }

  return (
    <>
       <div className="front_main">
            <div className="row align-items-center no-gutters">
                <aside className="col-md-6 sidebar_pic">
                    {/* <figure className="mb-0"><img src={IMAGES.LOGIN_BG} height="100%" width="100%" className="img-fluid" /></figure> */}
                </aside>

                <aside className="col-md-6">
                    <div className="ls_form">
                        <a className="text-center d-block"><img src={IMAGES.LOGO} className="Bally Houra" /></a>
                        <hgroup className="login_title_group">
                            <span>Enter the OTP recieved on your email</span>
                        </hgroup>

                        <FormikForm
                          onSubmit={submitHandler}
                            initialValues={{
                              [STRINGS.OTP]: STRINGS.EMPTY_STRING,
                            }}
                            validationSchema={validationHandler}
                        >
                            <div className="form-group">
                            <TextField
                              label={LABELS.OTP}
                              name={STRINGS.OTP}
                              placeholder={PLACEHOLDERS.OTP}
                              type="text"
                              maxLength="4"
                            
                            />
                            </div>

                            <div className="form-group">
                              <button className="btn btn-lg btn-primary w-100" type="submit">Verify OTP</button>
                            </div>                            

                            <div className="form-group text-center">
                              <span>Didn't Recieved the OTP? <a href="javascript:void(0);"   onClick={()=>{resendHandler()}}>
                                Resend OTP
                              </a></span> 
                              
                              {/* <button type="button" onClick={()=>{
                                resendHandler()
                              }}>Resend OTP</button> */}
                            </div>

                        </FormikForm>
                    </div>

                </aside>
            </div>
        </div>

      {/* <span>Enter the OTP recieved on your email</span>
      <br/><br/>
      <FormikForm
       onSubmit={submitHandler}
        initialValues={{
          [STRINGS.OTP]: STRINGS.EMPTY_STRING,
        }}
        validationSchema={validationHandler}
      >
        <TextField
          label={LABELS.OTP}
          name={STRINGS.OTP}
          placeholder={PLACEHOLDERS.OTP}
          type="text"
          maxLength="4"
        />
        <br/>
        <button type="submit">Verify OTP</button>
      </FormikForm>
      <div>
        <span>Didn't Recieved the OTP?</span>
        <button type="button" onClick={()=>{
          resendHandler()
        }}>Resend OTP</button>
        </div> */}
    </>
  );
}

export default withSnackbar(OTP_Verification);