import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'
import {getLanguages} from '../api/LanguageApi'


class App extends React.Component {
  constructor(props) 
  {
      super(props);
      this.state={Languages:[]};
  }
  componentDidMount()
  {
      getLanguages.fork(
          ()=>this.setState({Languages:[]})
          ,(data) => this.setState({Languages:data})
      )
  }

  render() {
    return (
      <div>
        <Header />
        <HomePage Languages={this.state.Languages}/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;