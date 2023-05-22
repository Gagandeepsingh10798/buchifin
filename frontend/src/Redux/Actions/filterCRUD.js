
import { GET_CATEGORIES, GET_FILTERS, SET_FILTERS,SET_CATEGORIES, POST_FILTERS } from "./ActionType";

export const getFilter=(data)=>{
return{
    type:GET_FILTERS,
    data
}
}

export const setFilter=(payload)=>{
    return{
        type:SET_FILTERS,
        payload
    }
}


export const getCategories=(data)=>{
    return{
        type:GET_CATEGORIES,
        data
    }
}

export const setCategories=(payload)=>{
    return{
        type:SET_CATEGORIES,
        payload
    }
}

export const postFilter=(data,callback)=>{
    return{
        type:POST_FILTERS,
        data,
        callback
    }
}