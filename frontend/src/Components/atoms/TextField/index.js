import React from "react";
import { useField, ErrorMessage, useFormikContext } from "formik";
import { STRINGS, LABELS, PLACEHOLDERS } from "./../../../Shared/Constants"

function TextField(props) {
    const [field, meta] = useField(props);
    

    return (
        <>
            <label htmlFor={field.name}> {props.label} </label>
            <input {...field}{...props} autoComplete="off" className="form-control"  />           
            <div className="error"><ErrorMessage name={field.name} /></div> 
        </>

    )
}

export default TextField;