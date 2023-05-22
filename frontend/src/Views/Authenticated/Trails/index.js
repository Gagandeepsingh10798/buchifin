import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrail, gettrails } from "Redux/Actions/commonCRUD";
import { ICONS, ROUTE_CONSTANTS, titleCase } from "Shared";
import { useHistory } from "react-router";
import { all } from "@redux-saga/core/effects";
import "./style.scss";
import ReactPaginate from "react-paginate";
import ServerImage from "Components/atoms/Server_Image";
import { RatingStar } from "rating-star";
import Rating from "Components/atoms/Rating";
import StarRatings from "react-star-ratings";

function Trails() {
  const dispatch = useDispatch();
  const all_trails = useSelector((state) => state.trails.trails);
  const [trails, setTrails] = useState(all_trails);
  const history = useHistory();
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [items, setItems] = useState(all_trails);
  const [currentItems, setCurrentItems] = useState(items);
  const itemsPerPage = 8;

  useEffect(()=>{
    console.log("Hello rendering fine")
  },[])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const clickHandler = (trail_id) => {
    dispatch(getTrail(trail_id,()=>history.push(ROUTE_CONSTANTS.TRAIL_INFO.slice(0, -3) + trail_id,trail_id)));
    ;
  };

  useEffect(() => {
    setTrails(all_trails);
    setItems(all_trails);
    setCurrentItems(items);
  }, [all_trails]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items?.slice(itemOffset, endOffset));
    setPageCount(Math?.ceil(items?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  useEffect(() => {
    dispatch(gettrails());
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap w-100 page-title">
        <h4 className="h4">Retailers</h4>

        <div className="col_rht">
     
          <button
            className="btn btn-sm btn-primary"
            onClick={() => history.push(ROUTE_CONSTANTS.ADMIN_ADD_TRAIL)}
          > 
            Add Retailer
          </button>
        </div>
      </div>

      <div className="row trail_list">
        {currentItems?.map((value, index) => (
          <div
            className="col-xl-3 col-md-4 col-sm-6"
            onClick={() => clickHandler(value._id)}
          >
            <div className="trail_items">
              <figure>
                <ServerImage
                  url={value.trailImage}
                  width="600px"
                  height="600px"
                  className="img-fluid"
                />
              </figure>
              <div className="trail_summary">
                <h6>{titleCase(value.trailName)}</h6>
                <span className="trail_address">
                  <i className="mr-2">
                    <img src={ICONS.PinIcon} alt="Location" width="12" />
                  </i>
                  {`${
                    titleCase(value.trailCity) +
                    ", " +
                    titleCase(value?.trailCountry)
                  }`}
                </span>
                <div className="trail_level">
                  <span className="level_status">
                    {titleCase(value?.difficultyLevel)}
                  </span>
                  
                    <StarRatings
                      starDimension="15px"
                      starSpacing="0.5px"
                      rating={value?.ratingAverage?value.ratingAverage:0}
                      starRatedColor="#9dbf1b"
                    />
                  
                </div>
              </div>
              {/* <div className="buttons">
              <button className="delete_button">D</button>
              <button className="edit_button">E</button>
            </div> */}
            </div>
          </div>
        ))}
      </div>

      <ReactPaginate
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Trails;
