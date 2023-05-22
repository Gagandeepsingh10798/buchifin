import { Formik, Form } from "formik"

const FormikForm = ({
    onSubmit = () => {},
    initialValues,
    validationSchema,
    children
}) => {
      return (
          
        <Formik
            onSubmit={(val) => {
                onSubmit(val);
            }}
            initialValues={initialValues}
            validationSchema={validationSchema}
        >
            {(formik) => <Form>{children}</Form>}
        </Formik>
    )
}
export default FormikForm;