import React from 'react';
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts-more';
import * as _ from 'ramda'
HighchartsMore(ReactHighcharts.Highcharts);

export const graphOptions=(names, ratings)=>{return (
    {
        chart: {
            polar: true,
            type: 'line',
        },
        title: {
            text: '',
        },
        pane: {
            size: '80%'
        },
        xAxis: {
            categories: names,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },
        series: [{
            name: 'Skills ratings in %',
            data: ratings,
            pointPlacement: 'on'
        }],
          legend: {
                enabled: false
            }
    
    });};


export const DrawSkillsPanel=_.curry((container,config) =>
<section className="sub skills" >
    <h2>
        {"Domaine d'expertise"}
    </h2>
    <div id={container}>
        <ReactHighcharts config = {config}></ReactHighcharts>
    </div>
</section>);