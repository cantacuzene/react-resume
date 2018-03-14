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
        console.log("tutu");
     //   getLanguages.getAll().then((data)=>{
     //       this.setState({Languages:data});
      //  })

    }
    componentDidMount()
    {
        console.log("titi");
        getLanguages.fork(
            ()=>this.setState({Languages:[]})
            ,(data) => 
                {console.log("toto");
                return this.setState({Languages:data})}
        )
        
    }

    render(){
        let TransformDataToChart= _.map(ChartTagDrawer(this.props.width,this.props.height));
        let BuildsvgContainer = svgTagDrawer(this.props.width,this.props.height);
        let BuldSectionConainer = SectionTagDrawer(this.props.chartid);

        return this.state.Languages
        |> (_ => TransformDataToChart(_))
        |> (_ => BuildsvgContainer(_))
        |> (_ => BuldSectionConainer(_))
    }
}
Languages.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default Languages;