import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import * as reducers from './reducers'

const rootReducer = combineReducers({
  Config:reducers.ConfigReducer,
  Languages:reducers.LanguagesReducer,
  Experiences:reducers.ExperiencesReducer,
  Skills:reducers.SkillsReducer,
  Abouts:reducers.AboutsReducer,
  Educations:reducers.EducationsReducer,
  Titles: reducers.TitlesReducer,
  routing: routerReducer,
});

export default rootReducer;


