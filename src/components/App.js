import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'
import {getLanguages} from '../api/LanguageApi'
import {getSkills} from '../api/SkillsApi'

class App extends React.Component {
  constructor(props) 
  {
      super(props);
      this.state={Languages:[],Skills:{
        name:[],
        rate:[]
      }};
  }
  componentDidMount()
  {
      getLanguages.fork(
          ()=>this.setState({Languages:[]})
          ,(data) => this.setState({Languages:data})
      )
      getSkills.fork(
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
  }

  render() {
    return (
      <div>
        <Header />
        <HomePage Languages={this.state.Languages} Skills={this.state.Skills}/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;