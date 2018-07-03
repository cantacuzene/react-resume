import React, { Fragment } from 'react'
import * as _ from 'ramda'
import PropTypes from 'prop-types'
import TitleH2 from './Titles'

const EducationItem =(props) =>
<Fragment>
    <div className="school">
        <span className="left">{props.year}</span>
        <span className="right">{props.school}</span>
    </div>
    <div className="diplome">
        {props.title}<br/>
        <i className="grey">{props.location}</i>
    </div>
</Fragment>
EducationItem.propTypes={
    year:PropTypes.number,
    school:PropTypes.string,
    title:PropTypes.string,
    location:PropTypes.string
}
const Education = (props) =>{
    return (
    <section className="sub form">
        <TitleH2 text={props.Titles.Education}/>
        {props.Educations |> _.map((x)=><EducationItem key={`edu-${x.id}`} {...x} />)}
    </section>
    );
};
Education.propTypes ={
    Educations:PropTypes.array,
    Titles:PropTypes.object
}
export default Education;
