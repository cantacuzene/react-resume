import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
const drawData =(name,data)=>data? <Fragment><h3>{name}:</h3><p>{data}</p></Fragment>:<Fragment></Fragment>

const TimelineItem =(props) =>
<div className="timeline-item" >
    <div className="timeline-icon"></div>
    <div  className={ `timeline-content ${props.contentClassName}` }>
        <h2>
            {props.start} - {props.end} <br/> {props.title}, {props.company}
        </h2>
        {drawData("Description",props.description)}
        {drawData("Scrum",props.scrum)}
        {drawData("Architect",props.architect)}
        {drawData("Operations",props.operations)}
        {drawData("Stack",props.stack)}
    </div>
</div>
TimelineItem.propTypes = {
    description:PropTypes.string,
    scrum:PropTypes.string,
    contentClassName:PropTypes.string,
    stack:PropTypes.string,
    start:PropTypes.string,
    architect:PropTypes.string,
    operations:PropTypes.string,
    end:PropTypes.string,
    title:PropTypes.string,
    company:PropTypes.string
}
export default TimelineItem;