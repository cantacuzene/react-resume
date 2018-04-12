/* eslint react/prop-types: 0 */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import App from './components/App';
//import HomePage from './components/HomePage';
import "./styles/stylesheet.scss";
import * as actions from './actions/actions'
import {initialState} from './reducers/initialState'


const store = configureStore(initialState);

// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store);

const config= store.getState()?.Config;

const defaultLanguage = config.languages.filter(x=>x.selected)[0];

/*
const fetchLanguages=fetchAndDispatch(defaultLanguage.code,`Languages`,actions.LanguageActionCreator);
const fetchExperiences= fetchAndDispatch(defaultLanguage.code,'Experiences',actions.ExperiencesActionCreator);
const fetchSkills= fetchAndDispatch(defaultLanguage.code,'Skills',actions.SkillsActionCreator); 
const fetchEducations= fetchAndDispatch(defaultLanguage.code,'Educations',actions.EducationsActionCreator);
const fetchAbouts = fetchAndDispatch(defaultLanguage.code,'About',actions.AboutsActionCreator);

store.dispatch(fetchLanguages());
store.dispatch(fetchExperiences());
store.dispatch(fetchSkills());
store.dispatch(fetchEducations());
store.dispatch(fetchAbouts());
*/

store.dispatch(actions.changeWebSiteLanguage(defaultLanguage.code));

render(
    <AppContainer>
      <App store={store} history={history} />
    </AppContainer>,
    document.getElementById('app')
  );
  
  if (module.hot) {
    module.hot.accept('./components/Root', () => {
      const NewRoot = require('./components/Root').default;
      render(
        <AppContainer>
          <NewRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('app')
      );
    });
  }
  
