import React from 'react'

class TimelineItem extends React.Component{
    render(){
        return (
            <li>
                <div className="TimelineItem">
                    <h3>{this.props.title}</h3>
                    <p>
                        {this.props.description}
                    </p>
                </div>
            </li>

        );
    }
}

export default TimelineItem;