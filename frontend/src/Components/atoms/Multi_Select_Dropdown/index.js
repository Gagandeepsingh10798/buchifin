import { all } from "@redux-saga/core/effects";
import component from "react-select";

import Select from "react-select";
import { components } from "react-select";
import { compose } from "redux";
import Option from "./option";
import "./react-select.scss";
import { useField, ErrorMessage } from "formik";

const Multi_Select_Dropdown = ({
  options,
  multiselect,
  closeMenuOnSelect = false,
  hideSelectedOptions,
  changeHandler = () => {},
  allowSelectAll,
  defaultValue,
  value,
  ...props
 
}) =>
{
  
  const [field, meta] = useField({...props, name: props?.name ?? ""});
 
  return (
    <>
      <Select
        name={props.name}
        defaultValue={defaultValue}
        options={options}
        value={value}
        isMulti
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        components={{ Option }}
        onChange={changeHandler}
        allowSelectAll={allowSelectAll}
        className="react-select-dropmenu"
        classNamePrefix="react-select"
      />
      
      <div className="error"><ErrorMessage name={field.name} /></div> 
    </>
  );
};

export default Multi_Select_Dropdown;
