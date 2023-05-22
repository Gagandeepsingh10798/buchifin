import { useDispatch } from "react-redux";
import { getLink } from "Redux/Actions/commonCRUD";
import { IMAGES } from "Shared";
import ServerImage from "../Server_Image";
import "./style.scss";

function Card({
  Image,
  Title,
  Distance,
  Details,
  isFile,
  showButtons =true,
  fromDistance,
  openTime,
  closeTime,
  deleteHandler = () => {},
  cardIndex,
  updateHandler=()=>{},
}) {
  
  return (
    <div className="col-md-4">
      <div className="card_items">
        <div className="d-flex align-items-center">
          {isFile && Image ? (
            <figure className="card_image">
              <img src={URL.createObjectURL(Image)} width="60" alt="" />
            </figure>
          ) : (
            <figure className="card_image">
              {/* <img src={(Image)} width="60" alt="" /> */}
              <ServerImage url={Image} />
            </figure>
          )}
          <div className="card_summary">
            {Title && Title?.length ? (
              <h6 className="card_title">{Title}</h6>
            ) : null}
            {Distance && !(fromDistance) ? (
              <span className="distance">{Distance}</span>
            ) : null}

            {fromDistance && !(!Distance) ?(
              <span className="distance">{`${fromDistance} KM from starting point`}</span>
            ) : null}

            {openTime && closeTime ? (
              <span className="distance">{`Open Timings -${openTime + ":00"} -${
                closeTime + ":00"
              }`}</span>
            ) : null}
          </div>
        </div>
       {
       showButtons?
       <div className="text-right">
          <div class="action_group">
            {/* <button class="btn" type="button" onClick={()=>updateHandler()} >
              <img src={IMAGES.EDIT_BUTTON} alt="Edit Icon" />
            </button> */}
            {/* <button class="btn" type="button" onClick={()=>deleteHandler()} >
              <img src={IMAGES.TRASH_ICON} alt="Remove Icon" />
            </button> */}
          </div>
        </div>:null}
      </div>
    </div>
  );
}

export default Card;
