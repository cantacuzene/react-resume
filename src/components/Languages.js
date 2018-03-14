import React from 'react'
import LanguageChart from './LanguageChart'
import {getLanguages} from '../api/LanguageApi'
import PropTypes from 'prop-types';
import * as _ from 'ramda';



let ChartTagDrawer= _.curry( 
    (width,height,language) =><LanguageChart key={language.id} language={language.name} rate={language.rating} width={width} height={height} />
);

let svgTagDrawer = _.curry(
    (width,height,ChartTagDrawer) =>
    <svg  className="svg-content-responsive" preserveAspectRatio="xMinYMax meet" viewBox={"0 0 "+width+" "+height}>
    {ChartTagDrawer}
    </svg>
);

let SectionTagDrawer = _.curry(
    (chartid,svgTagDrawer) =>
    <section className="sub lang" >
        <h2>
                Langues
        </h2>
        <div className="center">
        <div id={chartid} className="svgContainerWebChart"> 
            {svgTagDrawer}
            </div>
        </div>   
    </section>
);

class Languages extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state={Languages:[]};
    }
    componentDidMount()
    {
        getLanguages.fork(
            ()=>this.setState({Languages:[]})
            ,(data) => this.setState({Languages:data})
        )
    }

    render(){
        let TransformDataToChart= _.map(ChartTagDrawer(this.props.width,this.props.height));
        let BuildsvgContainer = svgTagDrawer(this.props.width,this.props.height);
        let BuldSectionConainer = SectionTagDrawer(this.props.chartid);

        return this.state.Languages
        |>  TransformDataToChart
        |> BuildsvgContainer
        |> BuldSectionConainer
    }
}
Languages.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default Languages;