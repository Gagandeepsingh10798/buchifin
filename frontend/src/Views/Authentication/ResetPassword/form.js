import FormikForm from "Components/atoms/Formik";
import TextField from "Components/atoms/TextField";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { resetPassword } from "Redux/Actions/Auth";
import { LABELS, PLACEHOLDERS, REGEX, ROUTE_CONSTANTS, STRINGS } from "Shared";
import * as Yup from "yup";
import { withSnackbar } from "notistack";
import { IMAGES } from "Shared";

function Reset_Password_Form(props) {
  const currentEmail = useSelector((state) => state.email.email);
  const dispatch = useDispatch();
  const history = useHistory();
  const submitHandler = (val) => {
    let data = {
      password: val?.ConfirmPassword,
      email: currentEmail.email,
      code: "0000",
    };

    dispatch(
      resetPassword(data, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        if (type == "success") history.push(ROUTE_CONSTANTS.LOGIN);
      })
    );
  };
  const validationHandler = Yup.object({
    [STRINGS.PASSWORD]: Yup.string()
      .min(8, STRINGS.PASSWORD_MIN_LENGTH)
      .required(STRINGS.PASSWORD_EMPTY, STRINGS.EMPTY_FIELD)
      .matches(REGEX.PASSWORD, STRINGS.PASSWORD_CONSTRAINTS),
    [STRINGS.CONFIRM_PASSWORD]: Yup.string().oneOf(
      [Yup.ref("Password"), null],
      STRINGS.CONFIRM_PASSWORD_DOESNOT_MATCH
    ),
  });

  return (
    <>
      <div className="front_main">
        <div className="row align-items-center no-gutters">
          <aside className="col-md-6 sidebar_pic">
            <figure className="mb-0">
              <img
                src={IMAGES.LOGIN_BG}
                height="100%"
                width="100%"
                className="img-fluid"
              />
            </figure>
          </aside>

          <aside className="col-md-6">
            <div className="ls_form">
              <a className="text-center d-block">
                <img src={IMAGES.LOGO} className="Bally Houra" />
              </a>
              <hgroup className="login_title_group">
                <h1 className="h4">{STRINGS.RESET_PASSWORD}</h1>
              </hgroup>

              <FormikForm
                onSubmit={submitHandler}
                initialValues={{
                  [STRINGS.PASSWORD]: STRINGS.EMPTY_STRING,
                  [STRINGS.CONFIRM_PASSWORD]: STRINGS.EMPTY_STRING,
                }}
                validationSchema={validationHandler}
              >
                <div className="form-group">
                  <TextField
                    label={LABELS.PASSWORD}
                    name={STRINGS.PASSWORD}
                    placeholder={PLACEHOLDERS.PASSWORD}
                    type="password"
                  />
                </div>

                <div className="form-group">
                  <TextField
                    label={LABELS.CONFIRM_PASSWORD}
                    name={STRINGS.CONFIRM_PASSWORD}
                    placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
                    type="password"
                  />
                </div>
                <button className="btn btn-lg btn-primary w-100" type="submit">
                  {STRINGS.RESET_PASSWORD}
                </button>
              </FormikForm>
            </div>
          </aside>
        </div>
      </div>

      {/* <h1>
            {STRINGS.RESET_PASSWORD}
        </h1>
        <FormikForm 
        onSubmit={submitHandler}
        initialValues={{
            [STRINGS.PASSWORD]:STRINGS.EMPTY_STRING,
            [STRINGS.CONFIRM_PASSWORD]:STRINGS.EMPTY_STRING
        }}
        validationSchema={validationHandler}
        >
            <br/>
            <br/>
        
        <TextField
        label={LABELS.PASSWORD}
        name={STRINGS.PASSWORD}
        placeholder={PLACEHOLDERS.PASSWORD}
        type="password"
        />
        <br/>

        <TextField
        label={LABELS.CONFIRM_PASSWORD}
        name={STRINGS.CONFIRM_PASSWORD}
        placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
        type="password"
        />
        <br/>

        <button
        type="submit">
            {STRINGS.RESET_PASSWORD}
        </button>
        </FormikForm> */}
    </>
  );
}
export default withSnackbar(Reset_Password_Form);
