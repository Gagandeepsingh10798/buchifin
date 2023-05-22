import { ErrorMessage, useField } from "formik";
import Select from "react-select";
import './style.scss';

const Dropdown=({defaultValue=undefined,isSearchable=false,isClearable=false,options=[],placeholder="", changeHandler=()=>{},className="",...props})=>{
    const [field, meta] = useField({...props, name: props?.name ?? ""});
    return(
        <>
        <Select
        name={props.name}
        defaultValue={defaultValue}
        onChange={changeHandler}
        options={options}
        isSearchable={isSearchable}
        className={className}
        isClearable={isClearable}
        placeholder={placeholder}
        className="react-select-dropmenu"
        classNamePrefix="react-select"
        />
        <div className="error"><ErrorMessage name={field.name} /></div>
        </>

    )    
}

export default Dropdown;