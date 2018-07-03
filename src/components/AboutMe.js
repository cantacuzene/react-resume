import React from 'react';
import * as _ from 'ramda';
import PropTypes from 'prop-types';
import TitleH2 from './Titles'


const AboutItem =(props)=><p> {props.val}<br/><br/></p>
AboutItem.propTypes={
    val:PropTypes.string
}
const ListItem =(props) => <li>{props.val}</li>
ListItem.propTypes={
    val:PropTypes.string
}
const AboutMe = (props) => 
<section className="sub about">
    <TitleH2 text={props.Titles.About} />
    {props.cover|>_.map((x)=><AboutItem key={`AI-${x.id}`} val={x.value}/>)}
    <ul>{ props.interests|>_.map((x)=><ListItem key={`LI-${x.id}`} val={x.value}/>) }</ul>
</section>
AboutMe.propTypes={
cover:PropTypes.array,
interests:PropTypes.array,
Titles:PropTypes.object
}
export default AboutMe;