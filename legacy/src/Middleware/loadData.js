
import {fetchAndDispatch} from '../api/apiHelpers';
import {actions, types} from '../actions'
//import Future from 'fluture'


export const config =()=>
{
    let configMap = new Map();
    configMap.set(types.CHANGE_WEBSITE_LANGUAGE, (dispatch,action)=>{
        dispatch(actions.TitlesActions.request(action.language));
        dispatch(actions.LanguageActions.request(action.language));
        dispatch(actions.AboutsActions.request(action.language));
        dispatch(actions.EducationsActions.request(action.language));
        dispatch(actions.ExperiencesActions.request(action.language));
        dispatch(actions.SkillsActions.request(action.language));
    });
    configMap.set(types.FETCH_TITLES_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,`Titles`,actions.TitlesActions)())
    });
    configMap.set(types.FETCH_LANGUAGES_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,`Languages`,actions.LanguageActions)())
    });
    configMap.set(types.FETCH_EDUCATION_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,'Educations',actions.EducationsActions)())
    });
    configMap.set(types.FETCH_EXPERIENCES_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,'Experiences',actions.ExperiencesActions)())
    });
    configMap.set(types.FETCH_ABOUTS_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,'About',actions.AboutsActions)())
    });
    configMap.set(types.FETCH_SKILLS_REQUEST,(dispatch,action)=>{
        dispatch(fetchAndDispatch(action.language,'Skills',actions.SkillsActions)())
    });
    return configMap
}

/*
config waits for a Map object containning the following items:
    key: action type, value: a function dispatching and fetching data
*/
export const createFlutureMiddleware = (config) =>{
        return ({ dispatch }) => next => action =>{
            
            config.forEach((value,key)=>{ 
                if (key==action.type) {
                    value(dispatch,action);
                }
            });
            return next(action);
        }
} 