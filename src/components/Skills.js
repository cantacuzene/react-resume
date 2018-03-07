/* eslint react/prop-types: 0 */
import React from 'react';
//import {Link} from 'react-router';
import Highcharts from 'highcharts/highcharts';


const graphOptions=
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
        categories: ['C#', 'HTML', 'CSS','JS','Docker','SQL',
        'Linux','dotnet core', 'Hexagonal Architecture','React','Go','Ruby','Scrum Master', 'web architecture'],
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
        data: [90, 80, 70, 80, 60, 70,50,80,70,70,30,30,90],
        pointPlacement: 'on'
    }],
      legend: {
            enabled: false
        }

};

class Skills extends React.Component {

    componentDidMount()
    {
        if (this.props.modules) {
            this.props.modules.forEach(function (module) {
                module(Highcharts);
            });
        }
        this.chart = new Highcharts[this.props.type || "Chart"](
            this.props.container, 
            graphOptions
        );
        //trick to make highchart calculate correctly the charts width
        window.dispatchEvent(new Event('resize'));
    }

    componentWillUnmount()
    {
        this.chart.destroy();
    }

    render()
    {
        return (
         <section className="sub skills" >
            <h2>
                    {"Domaine d'expertise"}
            </h2>
            <div id={this.props.container}>
            </div>
         </section>
        );
    }

}


export default Skills;           