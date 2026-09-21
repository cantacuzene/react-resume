import React from 'react';
import PropTypes from 'prop-types';

const TitleH2 = (props) => 
    <h2>
    {props.text}
    </h2>

TitleH2.propTypes={
text:PropTypes.string,
}
export default TitleH2;