import * as Yup from "yup";
import TextField from "Components/atoms/TextField";
import { STRINGS, Form_Strings, LABELS, PLACEHOLDERS } from "Shared/Constants";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { ROUTE_CONSTANTS } from "Shared/Routes";
import Dropdown from "Components/atoms/Dropdown";
import { Country, State, City } from "country-state-city";
import { useDebugValue, useEffect, useState } from "react";
import Tag from "Components/atoms/Tag";
import { act } from "react-dom/test-utils";
import Multi_Select_Dropdown from "Components/atoms/Multi_Select_Dropdown";
import File_Field from "Components/atoms/FileField";
import { useDispatch, useSelector } from "react-redux";
import filterSagaWatcher from "Redux/Sagas/filterCRUD";
import { getCategories, getFilter } from "Redux/Actions/filterCRUD";
import {
  addtrail,
  getEquipments,
  getOtherFacilities,
  getProfiles,
  getTrail,
  gettrails,
  setLocation,
  updateTrail,
  uploadfile,
} from "Redux/Actions/commonCRUD";
import Reset_Password_Form from "Views/Authentication/ResetPassword/form";
import GpxMap from "Components/atoms/Map";
import "./style.scss";
import Card from "Components/atoms/Cards";
import { setAuthToken } from "Redux/Actions/Auth";
import { titleCase, updateAuthToken } from "Shared";
import { withSnackbar } from "notistack";
import CustomModal from "Components/atoms/Modal";
import MultipleFileUploader from "Components/atoms/MultipleFileUploader";
import jump from "jump.js";

function Edit_Trails(props) {
  const current_trail = useSelector(
    (state) => state.current_trail.current_trail
  );
  const [stateList, setStateList] = useState([]);
  let country = Country.getAllCountries();
  let countries = country.map((value) => value);
  const [cityList, setCityList] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [publicTransport, setPublicTransport] = useState(
    current_trail?.publicTransport
  );
  const [repairPoints, setRepairPoints] = useState(current_trail.bikesRepair?.map((value) =>
  Object.assign(
    {},
    {
      label: (
        <div>
          <img
            src={`https://${value?.imageUrl}`}
            height="30px"
            width="30px"
            style={{ borderRadius: "15%" }}
          />
          &nbsp;&nbsp;{value?.name}
        </div>
      ),
      value: value,
      id: value._id,
    }
  )
));

  const [garagePoints, setGaragePoints] = useState(current_trail?.garages);
  const [emergencyNumbers, setEmergencyNumber] = useState(current_trail?.emergencyNumbers);
  const [placesToStop, setPlacestoStop] = useState(current_trail?.placesToStop);
  const dispatch = useDispatch();
  const allCountries = countries.map((t) => ({
    value: t?.isoCode,
    label: t?.name,
  }));
  var filters = useSelector((state) => state.filter.filters) || [];
  var categories = useSelector((state) => state.category.category) || [];
  var coordinates = useSelector((state) => state.location.coordinates) || [];
  const all_Equipments = useSelector((state) => state.equipments.equipments);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [facilitiesDistance, setFacilitiesDistance] = useState(null);
  const [finalNearbyAttractions, setFinalNearbyAttractions] = useState();
  const [finalPublicTransport, setFinalPublicTransport] = useState([]);
  const [finalBikeRepairPoints, setFinalBikeRepairPoints] = useState([]);
  const [finalGaragePoints, setFinalGaragePoints] = useState([]);
  const [distanceModal, setDistanceModal] = useState(false);
  
  const [bikeRepairPoints, setBikeRepairPoints] = useState(current_trail?.bikesRepair?.map((value) =>
  Object.assign(
    {},
    {
      label: (
        <div>
          <img
            src={`https://${value?.imageUrl}`}
            height="30px"
            width="30px"
            style={{ borderRadius: "15%" }}
          />
          &nbsp;&nbsp;{value?.name}
        </div>
      ),
      value: value,
      id: value._id,
    }
  )
));
  const [nearbyAttractionspoints, setNearbyAttractionsPoints] = useState( current_trail?.placesToStop?.map((value) =>
  Object.assign(
    {},
    {
      label: (
        <div>
          <img
            src={`https://${value?.imageUrl}`}
            height="30px"
            width="30px"
            style={{ borderRadius: "15%" }}
          />
          &nbsp;&nbsp;{value?.name}
        </div>
      ),
      value: value,
      id: value._id,
    }
  )
));
  const [publicTransportPoints, setPublicTransportPoints] = useState(current_trail?.publicTransport?.map((value) =>
  Object.assign(
    {},
    {
      label: (
        <div>
          <img
            src={`https://${value?.imageUrl}`}
            height="30px"
            width="30px"
            style={{ borderRadius: "15%" }}
          />
          &nbsp;&nbsp;{value?.name}
        </div>
      ),
      value: value,
      id: value._id,
    }
  )
));
  const [garagesPoints, setGaragesPoints] = useState(current_trail?.garages?.map((value) =>
  Object.assign(
    {},
    {
      label: (
        <div>
          <img
            src={`https://${value?.imageUrl}`}
            height="30px"
            width="30px"
            style={{ borderRadius: "15%" }}
          />
          &nbsp;&nbsp;{value?.name}
        </div>
      ),
      value: value,
      id: value._id,
    }
  )
));
  const [currentFacility, setCurrentFacility] = useState([]);
  const [currentFacilityId, setCurrentFacilityId] = useState([]);
  const [currentFacilityValue, setCurrentFacilityValue] = useState([]);
  const nearbyAttractionsData = useSelector(
    (state) => state.facilities.nearbyAttractions
  );
  const publicTransportData = useSelector(
    (state) => state.facilities.publicTransport
  );
  const garagesData = useSelector((state) => state.facilities.garages);
  const bikeRepairData = useSelector((state) => state.facilities.bikeRepair);
  const toggleFileUploadModalView = () => {
    setFileUploadModal((value) => !value);
  };

  const toggleDistanceModalView = () => {
    setDistanceModal((value) => !value);
  };


  let category = categories.map((data) =>
    Object.assign({}, { label: data.name, value: data._id })
  );

  let filter_suitability = filters
    .filter((value) => value.type === 1)
    .map((value) => value.filter)[0]
    ?.map((data) => Object.assign({}, { label: data.name, value: data._id }));

  let filter_trail = filters
    .filter((value) => value.type === 3)
    .map((value) => value.filter)[0]
    ?.map((data) => Object.assign({}, { label: data.name, value: data._id }));
  let filter_difficulty = filters
    .filter((value) => value.type === 4)
    ?.map((value) => value.filter)[0]
    ?.map((data) => Object.assign({}, { label: data.name, value: data._id }));

  const current_trail_type = current_trail?.trailType?.map((value) =>
    Object.assign({}, { label: value?.name, value: value?._id })
  );
  const currentEquipments = current_trail?.equipments?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.image}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "50%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value?._id,
      }
    )
  );
  const current_category = current_trail.categories.map((value) =>
    Object.assign({}, { label: value?.name, value: value?._id })
  );
  const currrent_suitability = current_trail.suitability.map((value) =>
    Object.assign({}, { label: value?.name, value: value?._id })
  );

  const [trail_Category, set_Trail_Category] = useState(current_category);
  const [trail_Suitability, set_Trail_Suitability] =
    useState(currrent_suitability);
  const [trail_Type, set_Trail_Type] = useState(current_trail_type);
  const current_difficulty_level = filter_difficulty?.find(
    (value) => value.label === current_trail.difficultyLevel.name
  );

  const current_Coordinates = current_trail?.trailCoordinates;

  const mapPoints = current_Coordinates?.length && current_Coordinates.map((value) => Object.assign({}, {
    lat: value.latitude, lng: value.longitude
  }));

  const [trail_Country, set_Trail_Country] = useState({
    value: current_country?.isoCode,
    label: current_country?.name,
  });
  const [difficultyLevel, set_difficulty_level] = useState({
    label: current_difficulty_level?.label,
    value: current_difficulty_level?.value,
  });
  const current_country = allCountries?.find(
    (value) =>
      value?.label?.toLowerCase() == current_trail?.trailCountry?.toLowerCase()
  );
  const startPointCoordinates=useSelector((state)=>state?.location?.coordinates);
  const profileType = useSelector((state) => state?.profiles?.profiles);
  const [profiles, setProfiles] = useState([]);
  const current_Profiles = current_trail?.profileType?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.image}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "50%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value?._id,
      }
    )
  );
  const submithandler = (data) => {

    let formData = {
      id: current_trail?._id,
      trailName: data[Form_Strings.TRAIL_NAME],
      trailCountry: data["Country"]?.label,
      trailCity: data[Form_Strings.TRAIL_CITY],
      trailState: data[Form_Strings.TRAIL_STATE],
      trailImage: current_trail.trailImage,
      trailAddress: data[Form_Strings.TRAIL_ADDRESS],
      trailDistance: data[Form_Strings.TRAIL_LENGTH],
      trailDescription: data[Form_Strings.TRAIL_DESCRIPTION],
      // difficultyLevel: difficultyLevel?.value,
      activity: activity.map((value) => value.id),
      nearestTown: data[Form_Strings.NEAREST_TOWN],
      terrainType: data[STRINGS.TERRAIN_TYPE],
      startPoint: {
        type: "Point",
        coordinates:  startPointCoordinates ? [startPointCoordinates?.lng, startPointCoordinates?.lat] : current_trail.startPoint.coordinates,
        description: data[Form_Strings.TRAIL_START_POINT],
      },
      trailType: trail_Type?.map((value) => value.value),
      suitability: trail_Suitability.map((value) => value.value),
      categories: trail_Category?.map((value) => value.value),
      minimumTime: data[Form_Strings.MINIMUM_TIME],
      maximumTime: data[Form_Strings.MAXIMUM_TIME],
      locationUrl: data?.locationUrl,
      placesToStop: finalNearbyAttractions,
      garages: finalGaragePoints,
      publicTransport: finalPublicTransport,
      emergencyNumbers: emergencyNumbers,
      bikesRepair: finalBikeRepairPoints,
      profileType: data?.profiles?.map((value) => value?.value),
      equipments: data[Form_Strings.EQUIPMENTS]?.map((value) => value.value),
    };

    dispatch(
      updateTrail(formData, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        if (type == "success") {
          history.push(ROUTE_CONSTANTS.ADMIN_TRAILS);
          dispatch(gettrails());
        }
      })
    );
  };

  const bikeDistanceHandler = () => {
    let tempData = { ...currentFacility };
    tempData.value.distance = facilitiesDistance;
    setBikeRepairPoints((value) => [...value, tempData]);
    toggleDistanceModalView();
    setFacilitiesDistance(null);
  };

  const nearbyAttractionsDistanceHandler = () => {
    let tempData = { ...currentFacility };
    tempData.value.distance = facilitiesDistance;
    setNearbyAttractionsPoints((value) => [...value, tempData]);
    toggleDistanceModalView();
    setFacilitiesDistance(null);
  }

  const publicDistanceHandler = () => {
    let tempData = { ...currentFacility };
    tempData.value.distance = facilitiesDistance;
    setPublicTransportPoints((value) => [...value, tempData]);
    toggleDistanceModalView();
    setFacilitiesDistance(null);

  };
  const garagesDistanceHandler = () => {
    let tempData = { ...currentFacility };
    tempData.value.distance = facilitiesDistance;
    setGaragesPoints((value) => [...value, tempData]);
    toggleDistanceModalView();
    setFacilitiesDistance(null);

  };

  let current_Profile_Type = profileType.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "50%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value?._id,
      }
    )
  );



  const [activities, setActivities] = useState(
    current_trail?.activity?.map((data) =>
      Object.assign(
        {},
        { id: data._id, name: data.name, isSelected: data.isAdded }
      )
    )
  );
  var activity = activities?.filter((value) => value.isSelected === true);
  let current_Equipments = all_Equipments.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.image?.src}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "15%" }}
            />
            &nbsp;&nbsp;{value?.text}
          </div>
        ),
        value: value?.key,
      }
    )
  );

  const dropdownNearbyAttractions = nearbyAttractionsData?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "15%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value,
      }
    )
  );

  // const currentNearbyAttractions=

  const dropDownPublicTransport = publicTransportData?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "15%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value,
      }
    )
  );

  const dropDownGarages = garagesData?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "15%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value,
      }
    )
  );

  const dropdownBikeRepair = bikeRepairData?.map((value) =>
    Object.assign(
      {},
      {
        label: (
          <div>
            <img
              src={`https://${value?.imageUrl}`}
              height="30px"
              width="30px"
              style={{ borderRadius: "15%" }}
            />
            &nbsp;&nbsp;{value?.name}
          </div>
        ),
        value: value,
        id: value._id,
      }
    )
  );

  const citychangeHandler = (e) => {
    let city_list = City?.getCitiesOfState(countryCode, e?.value);
    setCityList(city_list?.map((value) => value));
  };
  const handler = (e) => { };

  const tag_selected_style = {
    background: "#9dbf1b",
    color: "black",
    border: "1px solid #E9550C",
  };
  const tag_unselected_style = {
    background: "#EBEBEB",
    border: "1px solid #1F4B81",
    color: "black",
  };

  const emergencyNumbersHandler = (value) => {
    let data = {
      name: value.EmergencyNumber,
      contactNumber: value.Number,
    };
    setEmergencyNumber([...emergencyNumbers, data]);
  };

  const placesHandler = (value) => {
    let data = {
      name: value.Places_Name,
      image: value.Places,
      distance: value.Places_Distance,
      fromDistance: value.Places_From_Distance,
    };

    setPlacestoStop([...placesToStop, data]);
  };

  const handleClick = () => {
    console.log("hi");
  };

  useEffect(() => {
    dispatch(getFilter());
    dispatch(getCategories());
    dispatch(getProfiles());
    dispatch(getEquipments());
    for (let i = 1; i < 5; i++) {
      dispatch(getOtherFacilities(i));
    }

    return () => {
      dispatch(setLocation([]));
      document.getElementById("map").classList.remove("visible");
      document.getElementById("map_close_btn").classList.remove("visible");
    };
  }, []);

  const changeHandler = (e) => { };
  const tag_clickHandler = (tagIndex) => {
    if (activities.length)
      setActivities((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
  };

  const errorHandler = (data) => {
    let keys = Object.keys(data.errors);
    const selector = `input[name=${keys[0]}]`;

    const errorElement = document.querySelector(selector);

    // if (errorElement) {
    //   errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   errorElement.focus();
    // }
  };

  const validationSchema = Yup.object({
    [STRINGS.TRAIL_NAME]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.STATE]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.TRAIL_CITY]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(25, "Maximum Length is 25"),
    [STRINGS.ADDRESS]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field")
      .max(100, "Maximum Length is 100"),
    [STRINGS.DESCRIPTION]: Yup.string()
      .min(2, "Minimum Length is 2")
      .required("This is a required field"),
    [STRINGS.TRAIL_LENGTH]: Yup.number()
      .positive("Length can't be a negative value")
      .required("Trail Length is a required field")
      .max(99, "Trail length should be less than 100 Km")
      .positive(),
    [STRINGS.MINIMUM_TIME]: Yup.string().required(STRINGS.EMPTY_FIELD),
    [STRINGS.MAXIMUM_TIME]: Yup.string().required(STRINGS.EMPTY_FIELD),
    // [STRINGS.TRAIL_IMAGE]: Yup.string().required(STRINGS.EMPTY_FIELD),
    [STRINGS.TRAIL_START_POINT]: Yup.string()
      .required(STRINGS.EMPTY_FIELD)
      .max(100, "Maximum 100 characters are allowed"),
    [STRINGS.NEAREST_TOWN]: Yup.string()
      .required(STRINGS.EMPTY_FIELD)
      .max(100, "Maximum 100 characters are allowed"),
    profiles: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    Equipments: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    trailType: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    suitability: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    category: Yup.array()
      .min(1, STRINGS.EMPTY_FIELD)
      .required(STRINGS.EMPTY_FIELD),
    difficultyLevel: Yup.object().required(STRINGS.EMPTY_FIELD).nullable(),
    Country: Yup.object().required(STRINGS.EMPTY_FIELD).nullable(),
  });

  const bikeRepairHandler = (val, option) => {
    if (option.action === "select-option") {
      setCurrentFacility(option.option);
      setCurrentFacilityId(4);
      setCurrentFacilityValue(val);
      toggleDistanceModalView();
    } else if (option.action === "remove-value") {
      setBikeRepairPoints(val);
    }
  };

  const publicTransportHandler = (val, option) => {
    if (option.action === "select-option") {
      setCurrentFacility(option.option);
      setCurrentFacilityId(3);
      setCurrentFacilityValue(val);
      toggleDistanceModalView();
    } else if (option.action === "remove-value") {
      setPublicTransportPoints(val);
    }
  };

  const garageHandler = (val, option) => {
    // console.log(val, option)
    if (option.action === "select-option") {
      setCurrentFacility(option.option);
      setCurrentFacilityId(2);
      setCurrentFacilityValue(val);
      toggleDistanceModalView();
    } else if (option.action === "remove-value") {
      setGaragesPoints(val);
    }
  };

  const nearbyAttractionsHandler = (val, option) => {
    if (option.action === "select-option") {
      setCurrentFacility(option.option);
      setCurrentFacilityId(1);
      setCurrentFacilityValue(val);
      toggleDistanceModalView();
    } else if (option.action === "remove-value") {
      setNearbyAttractionsPoints(val);
    }
  };

  const toggleHandler = () => {
    toggleFileUploadModalView();
  };

  const mapViewHandler = () => {
    document
      .getElementById("map")
      .classList.add("visible");
    document
      .getElementById("map_close_btn")
      .classList.add("visible");
    document.getElementById("map-sec").classList.add("visible");
  }

  const allFacilitiesUpdateHandler = () => {
    if (!facilitiesDistance <= 0) {
      if (currentFacilityId === 4) {
        bikeDistanceHandler();
      } else if (currentFacilityId === 3) {
        publicDistanceHandler();
      } else if (currentFacilityId === 2) {
        garagesDistanceHandler();
      }
      else if (currentFacilityId === 1) {
        nearbyAttractionsDistanceHandler();
      }
    } else {
      setError(true);
    }
  };
  useEffect(() => {
    if (nearbyAttractionspoints && nearbyAttractionspoints?.length) {
      setFinalNearbyAttractions(nearbyAttractionspoints.map((value) => Object.assign({}, {
        _id: value.value?._id,
        name: value.value?.name,
        image: value.value?.image,
        distance: value.value?.distance
      })))
    }
  }, [nearbyAttractionspoints])

  useEffect(() => {
    if (bikeRepairPoints && bikeRepairPoints?.length) {
      setFinalBikeRepairPoints(bikeRepairPoints.map((value) => Object.assign({}, {
        _id: value.value?._id,
        name: value.value?.name,
        image: value.value?.image,
        distance: value.value?.distance,
        openTime: value.value?.openTime,
        closeTime: value.value?.closeTime
      })))
    }

  }, [bikeRepairPoints])

  useEffect(() => {
    if (publicTransportPoints && publicTransportPoints?.length) {
      setFinalPublicTransport(publicTransportPoints.map((value) => Object.assign({}, {
        _id: value.value?._id,
        name: value.value?.name,
        image: value.value?.image,
        distance: value.value?.distance,
        openTime: value.value?.openTime,
        closeTime: value.value?.closeTime
      })))
    }

  }, [publicTransportPoints])

  console.log(garagesPoints)

  useEffect(() => {
    if (garagesPoints && garagesPoints?.length) {
      setFinalGaragePoints(garagesPoints.map((value) => Object.assign({}, {
        _id: value.value?._id,
        name: value.value?.name,
        image: value.value?.image,
        distance: value.value?.distance,
        openTime: value.value?.openTime,
        closeTime: value.value?.closeTime
      })))
    }
  }, [garagesPoints])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap w-100 page-title">
        <h4 className="h4">Edit trails</h4>
      </div>

      <div className="form_sec">
        <Formik
          onSubmit={submithandler}
          initialValues={{
            [STRINGS.TRAIL_NAME]: titleCase(current_trail?.trailName),
            [STRINGS.STATE]: titleCase(current_trail?.trailState),
            [STRINGS.TRAIL_CITY]: titleCase(current_trail?.trailCity),
            [STRINGS.ADDRESS]: titleCase(current_trail?.trailAddress),
            [STRINGS.DESCRIPTION]: titleCase(current_trail?.trailDescription),
            [STRINGS.TRAIL_LENGTH]: current_trail?.trailDistance,
            [STRINGS.MINIMUM_TIME]: current_trail?.minimumTime,
            [STRINGS.MAXIMUM_TIME]: current_trail?.maximumTime,
            [STRINGS.TRAIL_IMAGE]: current_trail?.trailImage,
            [STRINGS.TERRAIN_TYPE]: current_trail?.terrainType,
            [STRINGS.TRAIL_START_POINT]: titleCase(
              current_trail?.startPoint?.description
            ),
            [STRINGS.NEAREST_TOWN]: titleCase(current_trail?.nearestTown),
            profiles: current_Profiles,
            Equipments: currentEquipments,
            trailType: current_trail_type,
            suitability: currrent_suitability,
            category: current_category,
            difficultyLevel: current_difficulty_level,
            Country: {
              value: current_country?.value,
              label: current_country?.label,
            },
            locationUrl: current_trail?.locationUrl,
          }}
        // validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
              <CustomModal
                isOpen={distanceModal}
                handleToggle={toggleDistanceModalView}
              >
                <>
                  <div className="modal-header justify-content-center">
                    <h3>Add Distance</h3>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-12">
                        <TextField
                          label={STRINGS.DISTANCE}
                          placeholder={PLACEHOLDERS.WRITE_HERE}
                          name={STRINGS.FACILITIES_DISTANCE}
                          type="text"
                          onChange={(e) =>
                            setFacilitiesDistance(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {error ? (
                      <span className="error" a>
                        This is a Required Field
                      </span>
                    ) : null}

                    <div className="modal-footer justify-content-center">
                      <button
                        type="button"
                        className="btn btn-md btn-primary"
                        onClick={() => {
                          allFacilitiesUpdateHandler();
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>
              </CustomModal>
              <CustomModal
                isOpen={fileUploadModal}
                handleToggle={toggleFileUploadModalView}
              >
                <div className="modal-header justify-content-center">
                  <h3 className="h4">Upload Gpx Files</h3>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <MultipleFileUploader
                          name="Location"
                          placeholder=""
                          label="Upload File"
                          setFieldValue={("Location", props.setFieldValue)}
                          id="location"
                          showmap={true}
                          clickHandler={() => toggleHandler()}
                        />
                        {error ? (
                          <span className="error">
                            This is a required field
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </CustomModal>
              <div className="form-row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Trail Image</label>
                    <File_Field
                      name={STRINGS.TRAIL_IMAGE}
                      placeholder=""
                      label="Upload Trail Image"
                      setFieldValue={props.setFieldValue}
                      id="trail"
                      showmap={false}
                      showImage={false}
                      ImageUrl={current_trail?.trailImage}
                    />
                  </div>
                </div>
              </div>

              <fieldset>
                <legend>Trail Basic Info</legend>
                <div className="form-row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.TRAIL_NAME}
                        placeholder={PLACEHOLDERS.TRAIL_NAME}
                        name={STRINGS.TRAIL_NAME}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Country</label>
                      <Dropdown
                        defaultValue={current_country}
                        label={LABELS.COUNTRY}
                        options={countries.map((t) => ({
                          value: t?.isoCode,
                          label: t?.name,
                        }))}
                        className=""
                        isSearchable={true}
                        placeholder={PLACEHOLDERS.SELECT}
                        isClearable={true}
                        name="Country"
                        changeHandler={(e) => {
                          changeHandler(e);
                          set_Trail_Country(e);
                          props.setFieldValue("Country", e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.STATE}
                        placeholder={PLACEHOLDERS.WRITE_HERE}
                        name={STRINGS.STATE}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.CITY}
                        placeholder={PLACEHOLDERS.WRITE_HERE}
                        name={STRINGS.TRAIL_CITY}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="d-block">Upload Map</label>
                      <button
                        className="btn btn-md btn-cancel m-1"
                        type="button"
                        onClick={toggleFileUploadModalView}
                      >
                        Add Files
                      </button>
                      <button
                        className="btn btn-md btn-cancel m-1"
                        type="button"
                        onClick={() => {
                          mapViewHandler();
                        }}
                      >
                        View Map
                      </button>

                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={PLACEHOLDERS.ADDRESS}
                        placeholder={PLACEHOLDERS.ADDRESS}
                        name={STRINGS.ADDRESS}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.DESCRIPTION}
                        placeholder={PLACEHOLDERS.DESCRIPTION}
                        name={STRINGS.DESCRIPTION}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label={LABELS.TRAIL_LENGTH}
                        placeholder={PLACEHOLDERS.TRAIL_LENGTH}
                        name={STRINGS.TRAIL_LENGTH}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Profile Type</label>
                      <Multi_Select_Dropdown
                        name="profiles"
                        defaultValue={current_Profiles}
                        options={current_Profile_Type}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        allowSelectAll={true}
                        changeHandler={(e) => {
                          setProfiles(e);
                          props.setFieldValue("profiles", e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>{STRINGS.TRAIL_CATEGORY}</legend>
                <div className="form-row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>{STRINGS.TRAIL_CATEGORY_TYPE}</label>
                      <Multi_Select_Dropdown
                        name="category"
                        defaultValue={current_category}
                        options={category}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        allowSelectAll={true}
                        changeHandler={(e) => {
                          set_Trail_Category(e);
                          props.setFieldValue("category", e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>{STRINGS.TRAIL_SUITABILITY}</label>
                      <Multi_Select_Dropdown
                        name="suitability"
                        defaultValue={currrent_suitability}
                        options={filter_suitability}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        changeHandler={(e) => handler(e)}
                        allowSelectAll={true}
                        changeHandler={(e) => {
                          set_Trail_Suitability(e);
                          props.setFieldValue("suitability", e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>{STRINGS.DIFFICULTY_LEVEL}</label>
                      <Dropdown
                        defaultValue={{
                          label: current_difficulty_level?.label,
                          value: current_difficulty_level?.value,
                        }}
                        options={filter_difficulty}
                        placeholder={PLACEHOLDERS.SELECT}
                        name="difficultyLevel"
                        changeHandler={(e) => {
                          set_difficulty_level(e);
                          props.setFieldValue("difficultyLevel", e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>{STRINGS.TRAIL_DISTANCE}</legend>
                <div className="form-row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <TextField
                        label={LABELS.MINIMUM_TIME}
                        placeholder={PLACEHOLDERS.MINIMUM_TIME}
                        name={STRINGS.MINIMUM_TIME}
                        type="text"
                        className="without_ampm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <TextField
                        label={LABELS.MAXIMUM_TIME}
                        placeholder={PLACEHOLDERS.MAXIMUM_TIME}
                        name={STRINGS.MAXIMUM_TIME}
                        type="text"
                        className="without_ampm"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Activities</legend>
                <div className="d-flex active_tags">
                  {activities?.map((value, tagIndex) => (
                    <Tag
                      {...value}
                      tag_selected_style={tag_selected_style}
                      tag_unselected_style={tag_unselected_style}
                      tagIndex={tagIndex}
                      tag_clickHandler={tag_clickHandler}
                      is_deletable={false}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>{STRINGS.TRACKING_INFO}</legend>
                <div className="form-row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <TextField
                        label={STRINGS.NEAREST_TOWN}
                        placeholder={PLACEHOLDERS.WRITE_HERE}
                        name={STRINGS.NEAREST_TOWN}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <TextField
                        label={STRINGS.TRAIL_START_POINT}
                        placeholder={PLACEHOLDERS.WRITE_HERE}
                        name={STRINGS.TRAIL_START_POINT}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <TextField
                        label={STRINGS.TERRAIN_TYPE}
                        placeholder={PLACEHOLDERS.WRITE_HERE}
                        name={STRINGS.TERRAIN_TYPE}
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Trail Type</label>
                      <Multi_Select_Dropdown
                        name="trailType"
                        defaultValue={current_trail_type}
                        options={filter_trail}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        changeHandler={(e) => handler(e)}
                        allowSelectAll={true}
                        changeHandler={(e) => {
                          set_Trail_Type(e);
                          props.setFieldValue("trailType", e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{STRINGS.EQUIPMENT}</label>
                      <Multi_Select_Dropdown
                        name="Equipments"
                        defaultValue={currentEquipments}
                        options={current_Equipments}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        changeHandler={(e) => handler(e)}
                        allowSelectAll={true}
                        changeHandler={(e) => {
                          props.setFieldValue("Equipments", e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* <fieldset>
                <legend>Places to Stop</legend>

                <div className="form-row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Upload Image</label>
                      <File_Field
                        name={STRINGS.TRAIL_IMAGE}
                        placeholder=""
                        label="Upload Image"
                        setFieldValue={props.setFieldValue}
                        id="trail"
                        fileName="Places"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label="Name"
                        type="text"
                        name="Places_Name"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label="From Distance (optional)"
                        type="number"
                        name="Places_From_Distance"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <TextField
                        label="Distance"
                        type="number"
                        name="Places_Distance"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col-md-12 text-right">
                    <div className="form-group">
                      <label className="d-none d-md-block">&nbsp;</label>
                      <button
                        className="btn btn-md btn-primary"
                        type="button"
                        onClick={() => placesHandler(props.values)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card_preview">
                  <div className="form-row">
                    {placesToStop?.map((value) => (
                      <Card
                        Image={value.image}
                        Title={value.name}
                        Distance={`${value.distance} KM `}
                        fromDistance={value.fromDistance}
                        isFile={false}
                        handleClick={handleClick}
                      />
                    ))}
                  </div>
                </div>
              </fieldset> */}

              <fieldset>
                <legend>{STRINGS.OTHER_FACILITIES}</legend>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Nearby Attractions</label>
                    <Multi_Select_Dropdown
                      name="Nearby Attractions"
                      options={dropdownNearbyAttractions}
                      value={nearbyAttractionspoints}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      changeHandler={(e) => handler(e)}
                      allowSelectAll={true}
                      changeHandler={(e, option) => {
                        nearbyAttractionsHandler(e, option)
                        props.setFieldValue("Nearby Attractions", e);
                      }}
                    />
                  </div>
                </div>
                {nearbyAttractionspoints && nearbyAttractionspoints?.length
                  ? nearbyAttractionspoints.map((value) => (
                    <div>
                      <Card
                        Image={value.value.image}
                        Title={value.value.name}
                        Distance={`${value.value.distance} KM from starting point`}
                        isFile={false}

                      />
                    </div>
                  ))
                  : null}

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Bike Repair Points</label>
                    <Multi_Select_Dropdown
                      name={STRINGS.BIKE_REPAIR}
                      value={bikeRepairPoints}
                      options={dropdownBikeRepair}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      allowSelectAll={true}
                      changeHandler={(e, option) => {
                        bikeRepairHandler(e, option);
                        props.setFieldValue(STRINGS.BIKE_REPAIR, e);
                      }}
                    />
                  </div>
                </div>
                {bikeRepairPoints && bikeRepairPoints?.length
                  ? bikeRepairPoints?.map((value) => (
                    <div>
                      <Card
                        Image={value.value?.image}
                        Title={value.value?.name}
                        Distance={`${value.value?.distance} KM from starting point`}
                        isFile={false}
                        openTime={value?.value?.openTime}
                        closeTime={value?.value?.closeTime}
                      />
                    </div>
                  ))
                  : null}

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Public Transport</label>
                    <Multi_Select_Dropdown
                      name="Public Transport"
                      options={dropDownPublicTransport}
                      value={publicTransportPoints}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      allowSelectAll={true}
                      changeHandler={(e, option) => {
                        publicTransportHandler(e, option);
                        props.setFieldValue("Public Transport", e);
                      }}
                    />
                  </div>
                </div>
                {publicTransportPoints && publicTransportPoints?.length
                  ? publicTransportPoints.map((value) => (
                    <div>
                      <Card
                        Image={value.value.image}
                        Title={value.value.name}
                        Distance={`${value.value.distance} KM from starting point`}
                        isFile={false}
                        openTime={value?.value?.openTime}
                        closeTime={value?.value?.closeTime}
                      />
                    </div>
                  ))
                  : null}

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Garages</label>
                    <Multi_Select_Dropdown
                      name="Garages"
                      value={garagesPoints}
                      options={dropDownGarages}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      changeHandler={(e) => handler(e)}
                      allowSelectAll={true}
                      changeHandler={(e, option) => {
                        garageHandler(e, option);
                        props.setFieldValue("Garages", e);
                      }}
                    />
                  </div>
                </div>
                {garagesPoints && garagesPoints?.length
                  ? garagesPoints.map((value) => (
                    <div>
                      <Card
                        Image={`https://${value.value?.imageUrl}`}
                        Title={value.value?.name}
                        Distance={`${value?.value?.distance} KM from starting point`}
                        isFile={false}
                        openTime={value?.value?.openTime}
                        closeTime={value?.value?.closeTime}
                      />
                    </div>
                  ))
                  : null}

              </fieldset>
              {(!startPointCoordinates) && mapPoints && mapPoints?.length ? <GpxMap points={mapPoints} /> : null}

              <div className="card-footer px-0">
                <button className="btn btn-lg btn-cancel m-1" type="submit">
                  Cancel
                </button>
                <button
                  className="btn btn-lg btn-secondary m-1"
                  type="submit"
                // onClick={() => console.log(props.values)}
                >
                  Update Trail
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default withSnackbar(Edit_Trails);
