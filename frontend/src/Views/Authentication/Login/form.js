import React, { useDebugValue } from "react";
import FormikForm from "Components/atoms/Formik";
import TextField from "Components/atoms/TextField";
import { Route, useHistory } from "react-router";
import * as Yup from "yup";
import "./style.scss";
import { withSnackbar } from "notistack";


import {
    STRINGS,
    LABELS,
    PLACEHOLDERS,
    REGEX
} from "Shared/Constants"
import { ROUTE_CONSTANTS } from "Shared/Routes";
import { IMAGES } from "Shared";
import { useDispatch } from "react-redux";
import { login } from "Redux/Actions/Auth";
import { ControlPointSharp } from "@material-ui/icons";

function Login_Form(props) {
    

    const history = useHistory();
    const dispatch = useDispatch();

    const submitHandler = (val) => {
        let value = {
            email: val.Email?.toLowerCase(),
            password: val.Password
        }
        
        dispatch(login(value,(message, type) => {
                props.enqueueSnackbar(message, {
                  variant: type,
                  autoHideDuration: 2000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                  },
                });
               }
        ));
    };

    const validationHandler = Yup.object(
        {
            [STRINGS.EMAIL]: Yup.string().required(STRINGS.EMAIL_EMPTY).email(STRINGS.EMAIL_ERROR),
            [STRINGS.PASSWORD]: Yup.string().required(STRINGS.PASSWORD_EMPTY)
        }
    )

    return (
        <div className="front_main">
            <div className="row align-items-center no-gutters">
                <aside className="col-md-6 sidebar_pic">
                    <figure className="mb-0"><img src={IMAGES.LOGIN_BG} height="100%" width="100%" className="img-fluid" /></figure>
                </aside>

                <aside className="col-md-6">
                    <div className="ls_form">
                        {/* <a className="text-center d-block"><img src={IMAGES.LOGO} className="Bally Houra" /></a> */}
                        <hgroup className="login_title_group">
                            <h1 className="h4">Welcome back,</h1>
                            <h2 className="h4">Login</h2>
                        </hgroup>

                        <FormikForm
                            onSubmit={submitHandler}
                            initialValues={
                                {
                                    [STRINGS.EMAIL]: STRINGS.EMPTY_STRING,
                                    [STRINGS.PASSWORD]: STRINGS.EMPTY_STRING
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
                                <TextField
                                    label={LABELS.PASSWORD}
                                    name={STRINGS.PASSWORD}
                                    placeholder={PLACEHOLDERS.PASSWORD}
                                    type="password"
                                />
                            </div>                            

                            <div className="form-group text-right">
                                <a href="javascript:void(0);" className=""
                                    onClick={() => history.push(ROUTE_CONSTANTS.FORGOT_PASSWORD)}>
                                    {`${STRINGS.FORGOT_PASSWORD} ?`}
                                </a>
                            </div>

                            <button className="btn btn-lg btn-primary w-100" type="submit">
                                {STRINGS.LOGIN}
                            </button>

                        </FormikForm>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default withSnackbar(Login_Form);