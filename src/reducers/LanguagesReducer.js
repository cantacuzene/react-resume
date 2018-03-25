import * as types  from '../actions/ActionTypes';



export const  initialState= {Languages:[],
    Experiences:[],
    Educations:[],
    Abouts:{
      cover:[],interests:[]
    },
    Skills:{
    names:[],
    ratings:[]
  }};

export const LanguagesReducer = (state= initialState.Languages,action)=>{
   
    let newState;
    switch (action.type)
    {
        case types.FETCH_LANGUAGES_REQUEST:
            console.log("test")
            return state;
        case types.FETCH_LANGUAGES_SUCCESS:
            newState= [...action.payload, ...state];
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
              console.log(newState,'//////////');
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
            newState= [...action.payload, ...state];
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
                cover:[...action.payload.cover,...state.cover],
                interests:[...action.payload.interests,...state.interests],
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
            newState = [...action.payload, ...state];
            return newState;
        default:
            return state;
    }
  }