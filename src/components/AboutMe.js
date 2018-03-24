import React from 'react';
import * as _ from 'ramda';
import Proptypes from 'prop-types';


const AboutItem =(props)=><p> {props.val}<br/><br/></p>
AboutItem.propTypes={
    val:Proptypes.string
}
const ListItem =(props) => <li>{props.val}</li>
ListItem.propTypes={
    val:Proptypes.string
}
const AboutMe = (props) => 
<section className="sub about">
    <h2>
    A propos
    </h2>
    {props.cover|>_.map((x)=><AboutItem key={`AI-${x.id}`} val={x.value}/>)}
    <ul>{ props.interests|>_.map((x)=><ListItem key={`LI-${x.id}`} val={x.value}/>) }</ul>
</section>
AboutMe.propTypes={
cover:Proptypes.array,
interests:Proptypes.array
}
export default AboutMe;