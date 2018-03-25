import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'

import * as actions from '../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const App = ({Languages=[],Skills={  name:[],rate:[]},Abouts={ cover:[],interests:[]},Experiences=[],Educations=[]}) => (
      <div>
        <Header />
        <HomePage Languages={Languages} Skills={Skills} Experiences={Experiences} 
          Educations={Educations} Abouts={Abouts}/>
      </div>
);

App.propTypes = {
  children: PropTypes.element,
    Languages:PropTypes.array,
    Skills:PropTypes.object,
    Experiences:PropTypes.array,
    Educations:PropTypes.array,
    Abouts:PropTypes.object
};

const mapStateToProps= state =>(
  {
    Languages:state.Languages,
    Skills:state.Skills,
    Abouts:state.Abouts,
    Experiences:state.Experiences,
    Educations:state.Educations
  });

const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(App);