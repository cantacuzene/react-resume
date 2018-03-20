import React from 'react'
import LanguageChart from './LanguageChart'
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

const LanguageList = (props)=> 
{
        let TransformDataToChart= _.map(ChartTagDrawer(props.width,props.height));
        let BuildsvgContainer = svgTagDrawer(props.width,props.height);
        let BuldSectionConainer = SectionTagDrawer(props.chartid);

        return props.Languages
        |> TransformDataToChart
        |> BuildsvgContainer
        |> BuldSectionConainer
}

LanguageList.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default LanguageList;