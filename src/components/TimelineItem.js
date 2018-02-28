import React from 'react'

class TimelineItem extends React.Component{

    render(){

        let stack=null;
        if(this.props.stack)
        {
            stack=<p className> <h3>Stack:</h3>
                    {this.props.stack}</p>
        }

        let scrum=null;
        if(this.props.scrum)
        {
            scrum=<p className> <h3>Scrum Master role:</h3>
                    {this.props.scrum}</p>
        }
        let architect=null;
        if(this.props.architect)
        {
            architect=<p className> <h3>Architect role:</h3>
                    {this.props.architect}</p>
        }
        let description=null;
        if(this.props.description)
        {
            description=<p className> <h3>Description:</h3>
                    {this.props.description}</p>
        }
        let operations=null;
        if(this.props.operations)
        {
            operations=<p className> {this.props.operations}</p>
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