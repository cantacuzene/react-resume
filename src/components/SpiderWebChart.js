import React from 'react'

import * as d3 from 'd3'

class SpiderWebChart extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            maxValue:0,
            allAxis:[]
        };

        this.onMouseOverPolygon = this.onMouseOverPolygon.bind(this);
        this.onMouseOutPolygon = this.onMouseOutPolygon.bind(this);
        this.onMouseOutCircle = this.onMouseOutCircle.bind(this);
        this.onMouseOverCircle = this.onMouseOverCircle.bind(this);
    }

    componentDidMount()
    {
        this.setState({
            maxValue :Math.max(this.props.maxValue, d3.max(this.props.Data, function(d,i,data){return d3.max(d.map(function(o){return o.rating;}))})),
            allAxis :(this.props.Data[0].map(function(i, j){
                return i.name})),
            total :this.props.Data[0].length,
            radius :this.props.factor*Math.min(this.props.width/2, this.props.height/2),
            Format :d3.format('%')
        });
        //this.getData();


    }

    getLevelFactor(currentLevel)
    {
        return this.props.factor*this.state.radius*((currentLevel+1)/this.props.levels)
    }

    drawCircularSegments(){
        let returnValue = [];
        for(let j=0; j<this.props.levels-1; j++){
	        let levelFactor = this.getLevelFactor(j);
            this.state.allAxis.map((item,i)=>{
                returnValue.push(
                    <line className="line" key={`line${i}-level${j}`}
                    x1={levelFactor*(1-this.props.factor*Math.sin(i*this.props.radians/this.state.total))} 
                    y1={levelFactor*(1-this.props.factor*Math.cos(i*this.props.radians/this.state.total))} 
                    x2={levelFactor*(1-this.props.factor*Math.sin((i+1)*this.props.radians/this.state.total))} 
                    y2={levelFactor*(1-this.props.factor*Math.cos((i+1)*this.props.radians/this.state.total))}
                    style={{stroke:'grey',strokeOpacity:0.75,strokeWidth:'3px'}}
                    transform={`translate(${this.props.width/this.props.centerOffset-levelFactor},${this.props.height/this.props.centerOffset-levelFactor})`}/>
                )
            });
        }
        return returnValue;
    }

    drawLevelValueInPercent(){
        let f= d3.format('.00%');
        let returnValue = [];
        for(let j=0; j<this.props.levels-1; j++){
	        let levelFactor = this.getLevelFactor(j);
            returnValue.push(
                <text className={"legend"}  key={`text${j}-line`}
                x={levelFactor*(1-this.props.factor*Math.sin(0))} 
                y={levelFactor*(1-this.props.factor*Math.cos(0))} 
                style={{fontFamily:'sans-serif',fontSize:'30px',fill:'#737373'}}
                transform={`translate(${this.props.width/this.props.centerOffset-levelFactor+this.props.ToRight}, ${this.props.height/this.props.centerOffset-levelFactor})`}>
                    {f((j+1)*this.state.maxValue/this.props.levels)}
                </text>
            );
        }
        return returnValue;
    }


    drawAxises(){
          let returnValue = [];
          this.state.allAxis.map((item,i)=>{
                returnValue.push(
                    <g className={"axis"} key={`g-${i}`}>
                        <line className={"line"} key={`line-${i}`}
                        x1={this.props.width/this.props.centerOffset} 
                        y1={this.props.height/this.props.centerOffset} 
                        x2={this.props.width/this.props.centerOffset*(1-this.props.factor*Math.sin(i*this.props.radians/this.state.total))} 
                        y2={this.props.height/this.props.centerOffset*(1-this.props.factor*Math.cos(i*this.props.radians/this.state.total))} style={{stroke:'grey',strokeWidth:'1px'}}  />
                        <text className={"legend"} 
                            style={{fontFamily:'sans-serif',fontSize:'20px',fontWeight:'bold'}} 
                            textAnchor={"start"}  transform={"translate(0, -10)"} 
                            x={this.props.width/this.props.centerOffset*(1-this.props.factorLegend*Math.sin(i*this.props.radians/this.state.total))-1*Math.sin(i*this.props.radians/this.state.total)} 
                            y={this.props.height/this.props.centerOffset*(1-Math.cos(i*this.props.radians/this.state.total))-1*Math.cos(i*this.props.radians/this.state.total)}>
                                {item} 
                            </text>
                    </g>
                );
            });
        return returnValue;
    }

drawPolygons()
{
    let returnValue = [];
    let polygonsData = this.props.Data.map((y, x)=>{
	  let dataValues = y.map((item,i)=>{
          return (
              [
                    this.props.width/this.props.centerOffset*(1-(parseFloat(Math.max(item.rating, 0))/this.state.maxValue)*this.props.factor*Math.sin(i*this.props.radians/this.state.total)), 
                    this.props.height/this.props.centerOffset*(1-(parseFloat(Math.max(item.rating, 0))/this.state.maxValue)*this.props.factor*Math.cos(i*this.props.radians/this.state.total))
              ]
               
          );
      });
      dataValues.push(dataValues[0])
      return dataValues;
    });

    let series = polygonsData.map((PolygonSerie,index)=>{
            return PolygonSerie.map((point,i)=>{
                return `${point[0]},${point[1]}`;
            }).join(" ");
    });

    returnValue =series.map((serie,index)=>{
        return <polygon className={`radar-chart-serie${index}`} key={`polygon-${index}`} id={`polygon-${index}`}
                    style={{strokeWidth:'2px',stroke:this.props.color(index),fill:this.props.color(index),fillOpacity:this.props.opacityArea}} 
                    points={serie} onMouseOver={(e)=>this.onMouseOverPolygon(e)} onMouseOut={(e)=>this.onMouseOutPolygon(e)}/>
    });

    return returnValue;
}

onMouseOverPolygon(event)
{
    const polId= event.target.getAttribute('id');
    d3.selectAll('polygon')
        .transition(200)
	    .style("fill-opacity", 0.1); 
    d3.select(`#${polId}`)
        .transition(200)
	    .style("fill-opacity", 0.7); 
}
onMouseOutPolygon()
{
    d3.selectAll('polygon')
        .transition(200)
	    .style("fill-opacity", this.props.opacityArea); 
}

onMouseOverCircle(event)
{
    let f= d3.format('.00%');
    const newX= event.target.getAttribute('cx') -10;
    const newY= event.target.getAttribute('cy') -5;
    const id = event.target.getAttribute('id');
    const axis = event.target.getAttribute('data-axis');
    const rating = event.target.getAttribute('data-rating');
//console.log(newX);
    d3.select('#tooltip')
    	.attr('x', newX)
		.attr('y', newY)
        .text(f(rating))
        .transition(200)
	    .style('opacity', 1);
    d3.select('#tooltip-text')
    	.attr('x', newX)
		.attr('y', newY)
        .text(f(rating))
        .transition(200)
	    .style('opacity', 1);

    d3.selectAll("polygon")
	    .transition(200)
	    .style("fill-opacity", 0.1);

	d3.select(id)
	    .transition(200)
		.style("fill-opacity", .7);
}
onMouseOutCircle(event)
{
    d3.select('#tooltip')
        .transition(200)
        .style('opacity', 0);
    d3.selectAll("polygon")
	    .transition(200)
	    .style("fill-opacity", this.props.opacityArea); 
}


drawPoints()
{
    return this.props.Data.map((item,index)=>{
        return item.map((point, i)=>{
            return <circle className={`radar-chart-serie${index}`}  key={`circle${index}-${i}`}
                r={this.props.radius*1.8} 
                alt={Math.max(point.rating,0)}
                cx={ this.props.width/this.props.centerOffset*(1-(Math.max(point.rating, 0)/this.state.maxValue)*this.props.factor*Math.sin(i*this.props.radians/this.state.total))}
                cy={ this.props.height/this.props.centerOffset*(1-(Math.max(point.rating, 0)/this.state.maxValue)*this.props.factor*Math.cos(i*this.props.radians/this.state.total))}
                data-id={point.name} data-axis={point.name} data-rating={point.rating}
                style={{fill:this.props.color(index),fillOpacity:0.9}}
                 onMouseOver={this.onMouseOverCircle} onMouseOut={this.onMouseOutCircle}>
                <title>
                    {Math.max(point.rating, 0)}
                </title>
            </circle>
        });
    }).reduce((a,b)=>{return a.concat(b)})
}

    drawToolTip()
    {
        let array =[]
        array.push(
            <rect x="0" y="0" height="75" width="200" rx="10" ry="10" id={'tooltip'} style={{opacity:0,fontFamily:'sans-serif',fontSize:'30px',fill:'#fff',stroke:'#006600'}} >
                <text key={'tooltip-text'} />
            </rect>
        );
        return array;
    }

    render(){
        console.log('render');
           let drawSegments =[],drawLevel=[],drawAxis=[],drawPolygons=[],drawPoints =[],drawTooltip =[];


        if(this.state.allAxis.length != 0)
        {   
            drawSegments = this.drawCircularSegments();
            drawLevel = this.drawLevelValueInPercent();
            drawAxis = this.drawAxises();
            drawPolygons = this.drawPolygons();
            drawPoints =this.drawPoints();
            drawTooltip = this.drawToolTip();
        }

        //this.draw();
        return <section className="sub">
            <h2>
            Skills
            </h2>

            <div id={'test42'} className="svgContainer">       
                <svg className="svg-content-responsive" preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${this.props.width+this.props.ExtraWidthX} ${this.props.height+this.props.ExtraWidthY}`}>
                    <g transform={"translate(" + this.props.TranslateX + "," + this.props.TranslateY + ")"}>
                        {drawSegments}
                        {drawLevel}
                        {drawAxis}
                        {drawPolygons}
                        {drawPoints}
                        {drawTooltip}
                    </g>
                </svg>
            </div>
        </section>
            
 
    }
}


SpiderWebChart.defaultProps = {
    width: 500,
    height: 500,
    radius: 6,
    factor: 1,
    factorLegend: .85,
    levels:3,
	maxValue: 0,
	radians: 2 * Math.PI,
	opacityArea: 0.5,
	ToRight: 5,
	TranslateX: 80,
	TranslateY: 30,
	ExtraWidthX: 200,
	ExtraWidthY: 200,
    centerOffset:2,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    Data:[]
};

export default SpiderWebChart;