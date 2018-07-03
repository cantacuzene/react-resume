import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'

import {actions} from '../actions'
//import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


const App = ({Languages,Skills,Abouts,Experiences,Educations,Config,changeLanguage,Titles}) => (
      <div>
        <Header Config={Config} changeLanguage={changeLanguage} />
        <HomePage Languages={Languages} Skills={Skills} Experiences={Experiences} 
          Educations={Educations} Abouts={Abouts} Titles={Titles}/>
      </div>
);

App.propTypes = {
  children: PropTypes.element,
    Languages:PropTypes.array,
    Skills:PropTypes.object,
    Experiences:PropTypes.array,
    Educations:PropTypes.array,
    Abouts:PropTypes.object,
    Config:PropTypes.object,
    Titles:PropTypes.object,
    changeLanguage:PropTypes.func.isRequired
};

const mapStateToProps= state =>(
  {
    Languages:state.Languages,
    Skills:state.Skills,
    Abouts:state.Abouts,
    Experiences:state.Experiences,
    Educations:state.Educations,
    Titles:state.Titles,
    Config:state.Config
  });

const mapDispatchToProps = dispatch =>{
  return{
  //actions: bindActionCreators(actions, dispatch),
  //changeWebSiteLanguage:code => dispatch(actions.changeWebSiteLanguage(code)),
  changeLanguage: code => { dispatch(actions.changeWebSiteLanguage(code))  }

}}

export default connect(mapStateToProps,mapDispatchToProps)(App);