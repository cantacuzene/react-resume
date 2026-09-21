import React from 'react'
import Timeline from '../containers/Timeline'
import PropTypes from 'prop-types'
import TitleH2 from'./Titles'

const Experiences = (props) =>{
    return(
    <section className="sub experience exp">
        <TitleH2 text={props.Titles.Experiences}/>
        <Timeline Experiences={props.Experiences}/>
    </section>);
};
Experiences.propTypes={
    Experiences : PropTypes.array,
    Titles:PropTypes.object
}

export default Experiences;