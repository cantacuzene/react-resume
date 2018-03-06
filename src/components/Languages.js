import React from 'react'
//import * as d3 from 'd3'
import LanguageChart from './LanguageChart'
import LanguageApi from '../api/LanguageApi'
import PropTypes from 'prop-types';

class Languages extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={Languages:[]};
    }
    componentDidMount()
    {
        this.LanguageList();
    }

    LanguageList()
    {
        return LanguageApi.getAll().then((data)=>{
            this.setState({Languages:data});
        })
    }

    render(){
        let languages;
        if(this.state.Languages.length != 0)
        {
            languages =(<div id={this.props.chartid} className="svgContainerWebChart">
                    <svg  className="svg-content-responsive" preserveAspectRatio="xMinYMax meet" viewBox={"0 0 "+this.props.width+" "+this.props.height}>
                    <LanguageChart transform={`translate(${this.props.width/4},${this.props.height/2})`} language={this.state.Languages[0].name} rate={this.state.Languages[0].rating} width={this.props.width} height={this.props.height} />
                    <LanguageChart transform={`translate(${this.props.width/1.5},${this.props.height/2})`} language={this.state.Languages[1].name} rate={this.state.Languages[1].rating} width={this.props.width} height={this.props.height} />
                    </svg>
            </div>);
        }
        else
        {
            languages=(<div id={this.props.chartid} className="svgContainerWebChart"></div>)
        }
        return (
             <section className="sub lang" >
                <h2>
                        Langues
                </h2>
                <div className="center">
                    {languages}
                 </div>   
            </section>
        );

    }
}
Languages.propTypes = {
    chartid:PropTypes.number,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default Languages;