import React from 'react'
import * as d3 from 'd3'


export let computeOuterRadius = (height) =>(height/2)-10;
export let computeInnerRadius = (outerRadius) => outerRadius -20;
export let makeArc = (innerRadius,outerRadius) =>{
    return d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(2*Math.PI);
}
export let makeArcLine = (innerRadius,outerRadius) => d3.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius)
.cornerRadius(20)
.startAngle(-0.05);

export let DrawArc = (color,style1,arc)=><path fill={color} d={arc()} style={style1}></path>
export let DrawArcLine =   (rate,color,style2,arcLine) => <path fill={color} d={arcLine({endAngle:(2*Math.PI)*rate})}
style={style2}></path>


export let DrawChart = (language,rate,color,innerRadius,styleText,drawArc,drawArcLine) => <g >
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
{drawArc}
{drawArcLine}

<circle r={innerRadius} cx="0" cy="0"
        fill={color} fillOpacity="1"/>
<text textAnchor="middle" dy="15" dx="5" fill={d3.rgb("#ccc")}
    style={styleText}>
    
        <tspan x="0" dy="0">{language}</tspan>
</text>
</g>

export const languageChartStyle={
    insetshadow1:{
        filter:'url(#inset-shadow1)'
    },
    insetshadow2:{
        filter:'url(#inset-shadow2)'
    },
    styleText:{
        'fontSize': '35px'
    },
    colorInnerCircle:'#fff',
    colorArcline:'#67BAF5',
    colorArc:'#ccc'
}