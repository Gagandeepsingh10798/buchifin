import Tag from "Components/atoms/Tag";
import TextField from "Components/atoms/TextField";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ACTION_STATES } from "Redux/Actions/ActionStates";
import { POST_FILTERS } from "Redux/Actions/ActionType";
import { getFilter, postFilter } from "Redux/Actions/filterCRUD";
import { LABELS, PLACEHOLDERS, STRINGS } from "Shared";
import "./style.css";
import { withSnackbar } from "notistack";
import SingleSelectDropdown from "Components/atoms/SingleSelectDropdown";
import { getFilterByLanguage } from "Redux/Actions/commonCRUD";

function Add_Filters(props) {
  const [difficulty_level, set_difficulty_level] = useState([]);
  const [suitability, set_suitability] = useState([]);
  const [trail_type, set_trail_type] = useState([]);
  const filters = useSelector((state) => state.filter.filters);
  const dispatch = useDispatch();
  const [language, setLanguage] = useState({ value: 'en', label: 'English' });
  const [difficulty_level_value, set_difficulty_level_value] = useState();
  const [activity_value, set_activity_value] = useState();
  const [suitability_value, set_suitability_value] = useState();
  const [trail_type_value, set_trail_type_value] = useState();
  const [viewDifficultyLevel, setViewDifficultyLevel] = useState([]);
  const [viewSuitability, setViewSuitability] = useState([]);
  const [viewTrailType, setViewTrailType] = useState([]);

  const tag_selected_style = {
    background: "#9dbf1b",
    border: "1px solid #1F4B81",
  };
  const tag_unselected_style = {
    background: "#EBEBEB",
    border: "1px solid #E9550C",
  };

  useEffect(() => { }, []);

  useEffect(() => {
    if (filters && filters?.length) {
      set_difficulty_level(
        filters
          .filter((value) => value.type === 4)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 4,
              }
            )
          )
      );
      setViewDifficultyLevel(
        filters
          .filter((value) => value.type === 4)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 4,
              }
            )
          )
      );
    }

    if (filters && filters?.length) {
      set_trail_type(
        filters
          .filter((value) => value.type === 3)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 3,
              }
            )
          )
      );
      setViewTrailType(
        filters
          .filter((value) => value.type === 3)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 3,
              }
            )
          )
      );
    }

    if (filters && filters?.length) {
      set_suitability(
        filters
          .filter((value) => value.type === 1)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 1,
              }
            )
          )
      );
      setViewSuitability(
        filters
          .filter((value) => value.type === 1)
          ?.map((value) => value.filter)[0]
          ?.map((data) =>
            Object.assign(
              {},
              {
                name: data.name,
                isSelected: data.isSelected,
                isDeleted: data.isDeleted,
                type: 1,
              }
            )
          )
      );
    }
  }, [filters]);

  const difficulty_tag_handler = (tagIndex) => {
    if (difficulty_level?.length) {
      set_difficulty_level((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
      setViewDifficultyLevel((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
    }
  };

  const suitability_tag_handler = (tagIndex) => {
    if (suitability.length) {
      set_suitability((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });

      setViewSuitability((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
    }
  };

  const add_difficulty_handler = () => {
    let data = {
      name: difficulty_level_value,
      isSelected: true,
      isDeleted: false,
      type: 4,
    };

    if (data?.name?.length > 3) {
      difficulty_level.push(data);
      viewDifficultyLevel.push(data);
    }
    set_difficulty_level_value("");
  };


  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
  ];
  const add_trail_type_handler = () => {
    let data = {
      name: trail_type_value,
      isSelected: true,
      isDeleted: false,
      type: 3,
    };
    if (data?.name?.length > 3) {
      trail_type.push(data);
      viewTrailType.push(data);
    }
    set_trail_type_value("");
  };
  const add_suitability_handler = () => {
    let data = {
      name: suitability_value,
      isSelected: true,
      isDeleted: false,
      type: 1,
    };
    if (data?.name?.length > 3) {
      suitability.push(data);
      viewSuitability.push(data);
      set_suitability_value("");
    }
  };


  const difficulty_delete_handler = (tagIndex) => {
    viewDifficultyLevel[tagIndex].isDeleted = true;
    difficulty_level.splice(tagIndex, 1);
  };


  const suitability_delete_handler = (tagIndex) => {
    viewSuitability[tagIndex].isDeleted = true;
    suitability.splice(tagIndex, 1);
  };

  const trail_type_delete_handler = (tagIndex) => {
    viewTrailType[tagIndex].isDeleted = true;
    trail_type.splice(tagIndex, 1);
  };

  const submitHandler = () => {
    let data = {
      filters: [
        ...viewDifficultyLevel,
        ...viewSuitability,
        ...viewTrailType,
      ],
    };

    dispatch(
      postFilter(data, (message, type) => {
        props.enqueueSnackbar(message, {
          variant: type,
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        dispatch(getFilter());
      })
    );
  };


  const trail_type_tag_handler = (tagIndex) => {
    if (trail_type.length) {
      set_trail_type((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
      setViewTrailType((value) => {
        return value.map((data, index) =>
          tagIndex === index
            ? Object.assign({}, data, { isSelected: !data.isSelected })
            : data
        );
      });
    }
  };

  useEffect(() => {
    if (language.value) {
      dispatch(getFilterByLanguage(language.value));
    }
  }, [language]);

  useEffect(() => {
    dispatch(getFilter())
  }, [])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap w-100 page-title">
        <h4 className="h4">Filters</h4>
        {/* <div className="col-md-4">
          <div className="form-group">
            <label>Language</label>
            <SingleSelectDropdown
              //  id={defaultSortValue[0]?.value}
              options={languageOptions}
              defaultValue={languageOptions[0]}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              allowSelectAll={true}
              changeHandler={(e) => {
                setLanguage(e);
              }}
            />
            <label>This sorting would reflect on App side</label>
          </div>
        </div> */}
      </div>

      <div className="form_sec">
        <fieldset>
          <legend>Difficulty Level</legend>
          <div className="form-row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  label="Name"
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  value={difficulty_level_value}
                  onChange={(e) => set_difficulty_level_value(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="d-none d-md-block">&nbsp;</label>
              <button
                className="btn btn-md btn-primary"
                onClick={() => add_difficulty_handler()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12">
              <div className="form-group">
                {/* <label>Activity Difficulty</label> */}
                <div className="d-flex active_tags">
                  {difficulty_level.map((value, tagIndex) => (
                    <Tag
                      {...value}
                      tag_selected_style={tag_selected_style}
                      tag_unselected_style={tag_unselected_style}
                      tagIndex={tagIndex}
                      tag_clickHandler={difficulty_tag_handler}
                      is_deletable={true}
                      delete_handler={difficulty_delete_handler}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* <fieldset>
          <legend>Activity</legend>
          <div className="form-row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  label="Name"
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  value={activity_value}
                  onChange={(e) => set_activity_value(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="d-none d-md-block">&nbsp;</label>
                <button
                  className="btn btn-md btn-primary"
                  onClick={() => add_activity_handler()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Activated</label>
                <div className="d-flex active_tags">
                  {activity.map((value, tagIndex) =>
                    !value.isDeleted ? (
                      <Tag
                        {...value}
                        tag_selected_style={tag_selected_style}
                        tag_unselected_style={tag_unselected_style}
                        tagIndex={tagIndex}
                        tag_clickHandler={tag_clickHandler}
                        is_deletable={true}
                        delete_handler={activity_delete_handler}
                      />
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </fieldset> */}

        <fieldset>
          <legend>Suitability</legend>
          <div className="form-row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  label="Name"
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  value={suitability_value}
                  onChange={(e) => set_suitability_value(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="d-none d-md-block">&nbsp;</label>
              <button
                className="btn btn-md btn-primary"
                onClick={() => add_suitability_handler()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12">
              <div className="form-group">
                {/* <label>Activated</label> */}
                <div className="d-flex active_tags">
                  {suitability.map((value, tagIndex) => (
                    <Tag
                      {...value}
                      tag_selected_style={tag_selected_style}
                      tag_unselected_style={tag_unselected_style}
                      tagIndex={tagIndex}
                      tag_clickHandler={suitability_tag_handler}
                      is_deletable={true}
                      delete_handler={suitability_delete_handler}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Trail Type</legend>
          <div className="form-row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  label="Name"
                  placeholder={PLACEHOLDERS.WRITE_HERE}
                  value={trail_type_value}
                  onChange={(e) => set_trail_type_value(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="d-none d-md-block">&nbsp;</label>
                <button
                  className="btn btn-md btn-primary"
                  onClick={() => add_trail_type_handler()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12">
              <div className="form-group">
                {/* <label>Activated</label> */}
                <div className="d-flex active_tags">
                  {trail_type.map((value, tagIndex) => (
                    <Tag
                      {...value}
                      tag_selected_style={tag_selected_style}
                      tag_unselected_style={tag_unselected_style}
                      tagIndex={tagIndex}
                      tag_clickHandler={trail_type_tag_handler}
                      is_deletable={true}
                      delete_handler={trail_type_delete_handler}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="card-footer px-0">
          <button
            className="btn btn-lg btn-secondary mt-2"
            onClick={() => submitHandler()}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default withSnackbar(Add_Filters);
