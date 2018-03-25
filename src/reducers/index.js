import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import * as reducers from './LanguagesReducer'

const rootReducer = combineReducers({
  Languages:reducers.LanguagesReducer,
  Experiences:reducers.ExperiencesReducer,
  Skills:reducers.SkillsReducer,
  Abouts:reducers.AboutsReducer,
  Educations:reducers.EducationsReducer,
  routing: routerReducer,

});

export default rootReducer;


