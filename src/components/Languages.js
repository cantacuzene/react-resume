import React from 'react'
//import * as d3 from 'd3'
import LanguageChart from './LanguageChart'
import LanguageApi from '../api/LanguageApi'
import PropTypes from 'prop-types';
import * as _ from 'ramda';



let ChartTagDrawer= _.curry( (width,height,language) =>{
    return (
         <LanguageChart language={language.name} 
         rate={language.rating} width={width} height={height} />
    );
});

let svgTagDrawer = _.curry((width,height,ChartTagDrawer) =>{
    return(
        <svg  className="svg-content-responsive" preserveAspectRatio="xMinYMax meet" viewBox={"0 0 "+width+" "+height}>
        {ChartTagDrawer}
       </svg>
    )
});

let SectionTagDrawer = _.curry((chartid,svgTagDrawer) => {
    return (
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
});

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
        let DataToChart= _.map(ChartTagDrawer(this.props.width,this.props.height));
        let ChartToSvg = svgTagDrawer(this.props.width,this.props.height);
        let SvgToSection = SectionTagDrawer(this.props.chartid);
        let draw =_.pipe(
            DataToChart,
            ChartToSvg,
            SvgToSection
        );
        return draw(this.state.Languages);
    }
}
Languages.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default Languages;