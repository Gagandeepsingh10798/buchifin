import Select from "react-select";
import Option from "../Multi_Select_Dropdown/option";
import "./style.scss";

const SingleSelectDropdown = ({
    options,
    hideSelectedOptions,
    changeHandler = () => {},
    allowSelectAll,
    defaultValue,
    id
  }) =>
  {
    return (
      <>
        <Select
          defaultValue={defaultValue}
          options={options}
          closeMenuOnSelect={true}
          hideSelectedOptions={hideSelectedOptions}
          components={{ Option }}
          onChange={changeHandler}
          allowSelectAll={allowSelectAll}
          className="react-select-dropmenu"
          classNamePrefix="react-select"
          key={id}
        
        />
      </>
    );
  };
  
  export default SingleSelectDropdown;
  