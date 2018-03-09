import React from 'react'
//import * as d3 from 'd3'
import LanguageChart from './LanguageChart'
import LanguageApi from '../api/LanguageApi'
import PropTypes from 'prop-types';
import * as _ from 'ramda';



let TagDrawer= _.curry( (width,height,language) =>{
    return (
         <LanguageChart language={language.name} 
         rate={language.rating} width={width} height={height} />
    );
});

let DrawLanguageChart = _.curry((width,height,TagDrawer) =>{
    return(

        <svg  className="svg-content-responsive" preserveAspectRatio="xMinYMax meet" viewBox={"0 0 "+width+" "+height}>
        {TagDrawer}
       </svg>
       
    )
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
        let draw =_.pipe(
            _.map(TagDrawer(this.props.width,this.props.height)),
            DrawLanguageChart(this.props.width,this.props.height)
        );
        return (
             <section className="sub lang" >
                <h2>
                        Langues
                </h2>
                <div className="center">
                <div id={this.props.chartid} className="svgContainerWebChart"> 
                    {draw(this.state.Languages)}
                    </div>
                 </div>   
            </section>
        );

    }
}
Languages.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
}
export default Languages;