/* eslint react/prop-types: 0 */
import React, { Fragment } from 'react';

class TimelineItem extends React.Component{

    render(){

        let stack=null;
        if(this.props.stack)
        {
            stack=<Fragment><h3>Stack:</h3><p> 
                    {this.props.stack}</p></Fragment>
        }

        let scrum=null;
        if(this.props.scrum)
        {
            scrum=<Fragment><h3>Scrum Master role:</h3><p> 
                    {this.props.scrum}</p></Fragment>
        }
        let architect=null;
        if(this.props.architect)
        {
            architect=<Fragment><h3>Architect role:</h3><p> 
                    {this.props.architect}</p></Fragment>
        }
        let description=null;
        if(this.props.description)
        {
            description=<Fragment><h3>Description:</h3><p> 
                    {this.props.description}</p></Fragment>
        }
        let operations=null;
        if(this.props.operations)
        {
            operations=<Fragment><p> {this.props.operations}</p></Fragment>
        }
        return (

            <div className="timeline-item">
                <div className="timeline-icon"></div>
                <div  className={ `timeline-content ${this.props.contentClassName}` }>
                    <h2>
                        {this.props.start} - {this.props.end} <br/> {this.props.title}, {this.props.company}
                    </h2>
                    {description}
                    {scrum}
                    {architect}
                    {operations}
                    {stack}
                </div>
            </div>

        );
    }
}

export default TimelineItem;