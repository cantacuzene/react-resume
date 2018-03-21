import React from 'react'
import Timeline from '../containers/Timeline'
import PropTypes from 'prop-types'

const Experiences = (props) =>{
    return(
    <section className="sub experience exp">
        <h2>
            Experiences
        </h2>
        <Timeline Experiences={props.Experiences}/>
    </section>);
};
Experiences.propTypes={
    Experiences : PropTypes.array
}

export default Experiences;