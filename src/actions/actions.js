import * as types from './ActionTypes'


export const LanguageActions={
    request:(language)=>{ return{
        type: types.FETCH_LANGUAGES_REQUEST,
        language
    }},
    
     success:(payload)=>{return {
        type: types.FETCH_LANGUAGES_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_LANGUAGES_ERROR,
        error
    }},
}
export const TitlesActions={
    request:(language)=>{ return{
        type: types.FETCH_TITLES_REQUEST,
        language
    }},
    
     success:(payload)=>{return {
        type: types.FETCH_TITLES_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_TITLES_ERROR,
        error
    }},
}

export const SkillsActions={
    request:(language)=>{ return{
        type: types.FETCH_SKILLS_REQUEST,
        language
    }},
    
     success:(payload)=>{return {
        type: types.FETCH_SKILLS_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_SKILLS_ERROR,
        error
    }},
}


export const AboutsActions={
    request:(language)=>{ return{
        type: types.FETCH_ABOUTS_REQUEST,
        language
    }},
    
     success:(payload)=>{return {
        type: types.FETCH_ABOUTS_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_ABOUTS_ERROR,
        error
    }},
}


export const EducationsActions={
    request:(language)=>{ return{
        type: types.FETCH_EDUCATION_REQUEST,
        language
    }},
    
     success:(payload)=>{return {
        type: types.FETCH_EDUCATION_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_EDUCATION_ERROR,
        error
    }},
}

export const ExperiencesActions={
    request:(language)=>{ return{
        type: types.FETCH_EXPERIENCES_REQUEST,
        language
    }},
    
    success:(payload)=>{return {
        type: types.FETCH_EXPERIENCES_SUCCESS,
        payload
    }},
    
    fail:(error)=>{return {
        type: types.FETCH_EXPERIENCES_ERROR,
        error
    }},
}




export const changeWebSiteLanguage=(language)=>{return {
    type: types.CHANGE_WEBSITE_LANGUAGE,
    language
}};