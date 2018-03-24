import React from 'react'
import PropTypes from 'prop-types'
import TimelineItem from '../components/TimelineItem'
import * as _ from 'ramda'



const drawTimeLineItem =(experience)=> <TimelineItem key={`tli-${experience.id}`} {...experience}/>
const Timeline = (props)=>{
    return(
        <div className="container">
        <section id="timeline">
            {props.Experiences |>_.map(drawTimeLineItem)}  
        </section>
        </div>
    );
}
Timeline.propTypes={
    Experiences: PropTypes.array
}
export default Timeline;