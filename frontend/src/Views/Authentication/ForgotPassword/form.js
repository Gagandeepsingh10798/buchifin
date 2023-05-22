import React from "react";
import * as Yup from "yup";
import TextField from "Components/atoms/TextField";
import { STRINGS, LABELS, PLACEHOLDERS } from "Shared/Constants";
import FormikForm from "Components/atoms/Formik";
import {useHistory} from "react-router-dom"
import { ROUTE_CONSTANTS } from "Shared/Routes";
import { useDispatch } from "react-redux";
import { sendOtp, setEmail } from "Redux/Actions/Auth";
import { withSnackbar } from "notistack";
import { IMAGES } from "Shared";


function Forgot_Password_Form(props) {

    const history=useHistory();
    const submitHandler = (val) => {
        let data={
            email: val?.Email
        }
         dispatch(sendOtp(data,(message, type) => {  
            props.enqueueSnackbar(message, {
              variant: type,
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });
            if(type=="success")
            history.push(ROUTE_CONSTANTS.OTP_VERIFICATION)
           }));
         dispatch(setEmail(data));
    }

    const dispatch=useDispatch();

    const validationHandler = Yup.object(
        {
            [STRINGS.EMAIL]: Yup.string().required().email(STRINGS.EMAIL_ERROR)
        }
    )


    return (
        <>
            <div className="front_main">
                <div className="row align-items-center no-gutters">
                    <aside className="col-md-6 sidebar_pic">
                        <figure className="mb-0"><img src={IMAGES.LOGIN_BG} height="100%" width="100%" className="img-fluid" /></figure>
                    </aside>

                    <aside className="col-md-6">
                        <div className="ls_form">
                            {/* <a className="text-center d-block"><img src={IMAGES.LOGO} className="Bally Houra" /></a> */}
                            <hgroup className="login_title_group">
                                <h1 className="h4">{STRINGS.FORGOT_PASSWORD}</h1>
                                <span>{STRINGS.RESET_PASSWORD_INSTRUCTIONS}</span>
                            </hgroup>


                            <FormikForm
                                onSubmit={submitHandler}
                                initialValues={{
                                    [STRINGS.EMAIL]: STRINGS.EMPTY_STRING,
                                }}
                                validationSchema={validationHandler}
                            >
                                <div className="form-group">
                                    <TextField
                                        label={LABELS.EMAIL}
                                        name={STRINGS.EMAIL}
                                        placeholder={PLACEHOLDERS.EMAIL}
                                        type="text"
                                    />
                                </div>
                                 <div className="form-group">
                                    <button  className="btn btn-lg btn-primary w-100" type="submit">
                                        {STRINGS.SEND_EMAIL}
                                    </button>
                                </div>
                                <div className="form-group m-0 text-center">
                                    <a href="javascript:void(0);"  onClick={()=>history.push(ROUTE_CONSTANTS.LOGIN)}>
                                        {STRINGS.LOGIN}
                                    </a>
                                </div>
                                {/* <button className="btn btn-lg btn-primary w-100" type="submit" onClick={()=>history.push(ROUTE_CONSTANTS.LOGIN)}>
                                    {STRINGS.LOGIN}
                                </button> */}

                            </FormikForm>

                        </div>

                    </aside>
                </div>
            </div>
        </>
    )
}

export default withSnackbar( Forgot_Password_Form);
