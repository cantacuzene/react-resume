import * as types from './ActionTypes'


export const fetchLanguagesRequest=()=>{ return{
    type: types.FETCH_LANGUAGES_REQUEST
}};

export const fetchLanguagesSucceded=(payload)=>{return {
    type: types.FETCH_LANGUAGES_SUCCESS,
    payload
}};

export const fetchLanguagesError=(error)=>{return {
    type: types.FETCH_LANGUAGES_ERROR,
    error
}};

export const fetchSkillsRequest=()=>{return {
    type: types.FETCH_SKILLS_REQUEST
}};

export const fetchSkillsSucceded=(payload)=>{return {
    type: types.FETCH_SKILLS_SUCCESS,
    payload
}};

export const fetchSkillsError=(error)=>{return {
    type: types.FETCH_SKILLS_ERROR,
    error
}};

export const fetchAboutsRequest=()=>{return {
    type: types.FETCH_ABOUTS_REQUEST
}};

export const fetchAboutsSucceded=(payload)=>{return {
    type: types.FETCH_ABOUTS_SUCCESS,
    payload
}};

export const fetchAboutsError=(error)=>{return {
    type: types.FETCH_ABOUTS_ERROR,
    error
}};
export const fetchEducationsRequest=()=>{return {
    type: types.FETCH_EDUCATION_REQUEST
}};

export const fetchEducationsSucceded=(payload)=>{return {
    type: types.FETCH_EDUCATION_SUCCESS,
    payload
}};

export const fetchEducationsError=(error)=>{return {
    type: types.FETCH_EDUCATION_ERROR,
    error
}};
export const fetchExperiencesRequest=()=>{return {
    type: types.FETCH_EXPERIENCES_REQUEST
}};

export const fetchExperiencesSucceded=(payload)=>{return {
    type: types.FETCH_EXPERIENCES_SUCCESS,
    payload
}};

export const fetchExperiencesError=(error)=>{return {
    type: types.FETCH_EXPERIENCES_ERROR,
    error
}};