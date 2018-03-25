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

/*
const fetchAnddispatch=(ressource)=>(requestAction)=>(errorAction)=>(sucessAction)=>{
  return (dispatch)=>{
    dispatch(requestAction());
   getRessources(ressource).fork(
     (error)=>dispatch(errorAction(error)),
     (data)=>{dispatch(sucessAction(data));
     })
   }};

   const fetchAnddispatch=(ressource)=>(requestAction)=>(errorAction)=>(sucessAction)=>()=>{
    return (dispatch)=>{
      dispatch(requestAction());
     getRessources(ressource).fork(
       (error)=>dispatch(errorAction(error)),
       (data)=>{dispatch(sucessAction(data));
       })
     }};
  
  const fetchLanguages=fetchAnddispatch(`Languages`,actions.fetchLanguagesRequest,actions.fetchLanguagesError,actions.fetchLanguagesSucceded);
  
  
  const fetchExperiences= fetchAnddispatch('Experiences',actions.fetchExperiencesRequest,actions.fetchExperiencesError,actions.fetchExperiencesSucceded);
  
  
  const fetchSkills= fetchAnddispatch('Skills',actions.fetchSkillsRequest,actions.fetchSkillsError,actions.fetchSkillsSucceded);
  
      
  const fetchEducations= fetchAnddispatch('Educations',actions.fetchEducationsRequest,actions.fetchEducationsError,actions.fetchEducationsSucceded)
  
  const fetchAbouts = fetchAnddispatch('Abouts',actions.fetchAboutsRequest,actions.fetchAboutsError,actions.fetchAboutsSucceded)
  
  */
          


const fetchLanguages= ()=>{
  return (dispatch)=>{
     dispatch(actions.fetchLanguagesRequest());
    getRessources('Languages').fork(
      (error)=>dispatch(actions.fetchLanguagesError(error)),
      (data)=>{dispatch(actions.fetchLanguagesSucceded(data));
      })
    }};

const fetchExperiences= ()=>{
      return (dispatch)=>{
         dispatch(actions.fetchExperiencesRequest());
        getRessources('Experiences').fork(
          (error)=>dispatch(actions.fetchExperiencesError(error)),
          (data)=>{dispatch(actions.fetchExperiencesSucceded(data));
          })
        }};

const fetchSkills= ()=>{
  return (dispatch)=>{
      dispatch(actions.fetchSkillsRequest());
    getRessources('Skills').fork(
      (error)=>dispatch(actions.fetchSkillsError(error)),
      (data)=>{dispatch(actions.fetchSkillsSucceded(data));
      })
    }};
    
const fetchEducations= ()=>{
  return (dispatch)=>{
      dispatch(actions.fetchEducationsRequest());
    getRessources('Educations').fork(
      (error)=>dispatch(actions.fetchEducationsError(error)),
      (data)=>{dispatch(actions.fetchEducationsSucceded(data));
      })
    }};

    const fetchAbouts= ()=>{
      return (dispatch)=>{
          dispatch(actions.fetchAboutsRequest());
        getRessources('About').fork(
          (error)=>dispatch(actions.fetchAboutsError(error)),
          (data)=>{dispatch(actions.fetchAboutsSucceded(data));
          })
        }};
    

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
  

  /*
  getRessources('Languages').fork(
    ()=>this.setState({Languages:[]})
    ,(data) => this.setState({Languages:data})
);
getRessources('Experiences').fork(
  ()=>this.setState({Experiences:[]})
  ,(data) => this.setState({Experiences:data})
);
getRessources('Educations').fork(
()=>this.setState({Educations:[]})
,(data) => this.setState({Educations:data})
);
getRessources('Abouts').fork(
()=>{   
this.setState({Abouts:{
  cover:[],interests:[]
}})}
,(data) => {
return this.setState({Abouts:{
  cover:data.cover,interests:data.interests
}})
}
);
getRessources('Skills').fork(
  ()=> this.setState({
    Skills:{
      name:[],
      rate:[]
    }
  }),
  (data)=>this.setState({
    Skills:{
      names:data.map(x=>x.name),
      ratings:data.map(x=>x.rating)
    }
  })
)
  
  
  
  */