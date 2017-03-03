import React, { PropTypes } from 'react';
import Header from './Header'
import Footer from './Footer'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;