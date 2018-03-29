/* eslint react/prop-types: 0 */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import App from './components/App';
//import HomePage from './components/HomePage';
import "./styles/stylesheet.scss";
import * as actions from './actions/actions'
import {getRessources} from './api/apiHelpers'
const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store);

          
 const fetchAndDispatch=(ressource,requestAction,errorAction,sucessAction)=>()=>{
  return (dispatch)=>{
    
    dispatch(requestAction());
   getRessources(ressource).fork(
     (error)=>dispatch(errorAction(error)),
     (data)=>{dispatch(sucessAction(data));
     })
   }};

const fetchLanguages=fetchAndDispatch(`Languages`,actions.fetchLanguagesRequest,actions.fetchLanguagesError,actions.fetchLanguagesSucceded);
const fetchExperiences= fetchAndDispatch('Experiences',actions.fetchExperiencesRequest,actions.fetchExperiencesError,actions.fetchExperiencesSucceded);
const fetchSkills= fetchAndDispatch('Skills',actions.fetchSkillsRequest,actions.fetchSkillsError,actions.fetchSkillsSucceded);  
const fetchEducations= fetchAndDispatch('Educations',actions.fetchEducationsRequest,actions.fetchEducationsError,actions.fetchEducationsSucceded)
const fetchAbouts = fetchAndDispatch('About',actions.fetchAboutsRequest,actions.fetchAboutsError,actions.fetchAboutsSucceded)
   

store.dispatch(fetchLanguages());
store.dispatch(fetchExperiences());
store.dispatch(fetchSkills());
store.dispatch(fetchEducations());
store.dispatch(fetchAbouts());

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
  
