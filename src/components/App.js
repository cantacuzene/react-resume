import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header'
import HomePage from './HomePage'
//import Footer from './Footer'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <HomePage/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;