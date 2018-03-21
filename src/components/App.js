import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'
import {getLanguages} from '../api/LanguageApi'
import {getSkills} from '../api/SkillsApi'
import {getExperiences} from '../api/Experiences'
import {getEductaions} from '../api/EducationApi'
import {getAbouts} from '../api/AboutApi'

class App extends React.Component {
  constructor(props) 
  {
      super(props);
      this.state={Languages:[],
        Experiences:[],Educations:[],Abouts:{
          cover:[],interests:[]
        },
        Skills:{
        name:[],
        rate:[]
      }};
  }
  componentDidMount()
  {
      getLanguages.fork(
          ()=>this.setState({Languages:[]})
          ,(data) => this.setState({Languages:data})
      );
      getExperiences.fork(
        ()=>this.setState({Experiences:[]})
        ,(data) => this.setState({Experiences:data})
    );
    getEductaions.fork(
      ()=>this.setState({Educations:[]})
      ,(data) => this.setState({Educations:data})
  );
  getAbouts.fork(
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
        <HomePage Languages={this.state.Languages} Skills={this.state.Skills} Experiences={this.state.Experiences} 
          Educations={this.state.Educations} Abouts={this.state.Abouts}/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;