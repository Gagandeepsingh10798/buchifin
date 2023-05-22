import { titleCase } from "Shared";
import "./tags.scss";
import { IMAGES } from "Shared";

const Tag = ({
  name = "",
  tagIndex,
  isSelected = false,
  tag_selected_style = {},
  tag_unselected_style = {},
  tag_clickHandler = () => {},
  delete_handler=()=>{},
  is_deletable = false,
}) => {
  let can_delete = is_deletable;
  
  return (
    <>
      <button
      type="button"
        className="block_tags"
        style={{
          ...(isSelected ? tag_selected_style : tag_unselected_style),        
          border:"none",          
        }}      
        onClick={(e) => {
          tag_clickHandler(tagIndex);
        }}
      >
        {titleCase(name)}
        <div className="del_div">
          {can_delete ? (
            <button className="btn"
              type="button"
             
              onClick={() => {
                delete_handler(tagIndex)
              }}
            ><img src={IMAGES.TRASH_ICON} alt="Remove Icon" /></button>
          ) : null}
        </div>
      </button>
    </>
  );
};

export default Tag;
