// import { Dropdown, DropdownMenu, Select } from "semantic-ui-react";
import Select from "react-select";
function ImageDropdown({defaultValue=undefined,isSearchable=false,isClearable=false,options=[],placeholder="", changeHandler=()=>{},className=""}) {
    
  return (
    <span>
      <Select
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
     </span>
  );
}

export default ImageDropdown;
