import * as types  from '../actions/ActionTypes';
import {initialState} from './initialState'




export const LanguagesReducer = (state= initialState.Languages,action)=>{
   
    let newState;
    switch (action.type)
    {
        case types.FETCH_LANGUAGES_REQUEST:
            return state;
        case types.FETCH_LANGUAGES_SUCCESS:
            newState= [...action.payload];
            return newState;
        default:
            return state;
    }
  }

  export const SkillsReducer = (state= initialState.Skills,action)=>{
    let newState;
    switch (action.type)
    {
        case types.FETCH_SKILLS_REQUEST:
            return state;
        case types.FETCH_SKILLS_SUCCESS:
            newState={
                names:action.payload.map(x=>x.name),
                ratings:action.payload.map(x=>x.rating)
              }
            return newState;
        default:
            return state;
    }
  }


  export const EducationsReducer = (state= initialState.Educations,action)=>{
    let newState;
    switch (action.type)
    {
        case types.FETCH_EDUCATION_REQUEST:
            return state;
        case types.FETCH_EDUCATION_SUCCESS:
            newState= [...action.payload];
            return newState;
        default:
            return state;
    }
  }

  export const AboutsReducer = (state= initialState.Abouts,action)=>{
    let newState;
    switch (action.type)
    {
        case types.FETCH_ABOUTS_REQUEST:
            return state;
        case types.FETCH_ABOUTS_SUCCESS:
            newState= {
                cover:[...action.payload.cover],
                interests:[...action.payload.interests],
              }
            return newState;
        default:
            return state;
    }
  }

  export const ExperiencesReducer = (state= initialState.Experiences,action)=>{
    let newState;
    switch (action.type)
    {
        case types.FETCH_EXPERIENCES_REQUEST:
            return state;
        case types.FETCH_EXPERIENCES_SUCCESS:
            newState = [...action.payload];
            return newState;
        default:
            return state;
    }
  }


  export const ConfigReducer = (state= initialState.Config,action)=>{
    let newState;
    switch (action.type)
    {
        case types.CHANGE_WEBSITE_LANGUAGE:
            newState = {languages:state.languages.map((x)=>{
                let {code,selected,label,id} = x;
                if(code == action.language)
                    selected = true;
                if(code != action.language)
                    selected = false
                return {code,selected,label,id}
            })};
            return newState;
        default:
            return state;
    }
  }