import React from 'react'
import PropTypes from 'prop-types';
import * as d3 from 'd3'

class LanguageChart extends React.Component
{
    render()
    {
      var color = ['#ccc','#67BAF5','#fff'];
 
        var outerRadius=(this.props.height/2)-10;
        var innerRadius=outerRadius-20;
 
        var arc=d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0)
            .endAngle(2*Math.PI);
 
        var arcLine=d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(20)
            .startAngle(-0.05);
    var style1={
            filter:'url(#inset-shadow1)'
        };
        var style2={
            filter:'url(#inset-shadow2)'
        };
        var styleText= {
            'fontSize': '35px'
        };


        return <g >
                        <defs>
                            <filter id={"inset-shadow1"}>
                                <feOffset dx="0" dy="0"/>
                                <feGaussianBlur stdDeviation="5" result="offset-blur"/>
                                <feComposite  operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                                <feFlood  floodColor="grey" floodOpacity="0.5" result="color"/>
                                <feComposite  operator="in" in="color" in2="inverse" result="shadow"/>
                                <feComposite  operator="over" in="shadow" in2="SourceGraphic"/>
                            </filter>
                        </defs>
                        <defs>
                            <filter id={"inset-shadow2"}>
                                <feOffset dx="0" dy="0"/>
                                <feGaussianBlur  stdDeviation="1" result="offset-blur"/>
                                <feComposite  operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                                <feFlood  floodColor="white" floodOpacity="0.5" result="color"/>
                                <feComposite  operator="in" in="color" in2="inverse" result="shadow"/>
                                <feComposite  operator="over" in="shadow" in2="SourceGraphic"/>
                            </filter>
                        </defs>

 
                        <path fill={color[0]} d={arc()} style={style1}></path>
                        <path fill={color[1]} d={arcLine({endAngle:(2*Math.PI)*this.props.rate})}
                              style={style2}></path>
                        <circle r={innerRadius} cx="0" cy="0"
                                fill={color[2]} fillOpacity="1"/>
                        <text textAnchor="middle" dy="15" dx="5" fill={d3.rgb("#ccc")}
                            style={styleText}>
                            
                                <tspan x="0" dy="0">{this.props.language}</tspan>
                                <tspan x="0" dy="1.2em">{this.props.rate*100+'%'}</tspan>
                        </text>
                    </g>
    }
}
LanguageChart.propTypes = {
    height:PropTypes.number,
    language:PropTypes.string,
    rate:PropTypes.number,
 
}
export default LanguageChart;