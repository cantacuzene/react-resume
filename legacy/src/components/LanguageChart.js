import PropTypes from 'prop-types';
import * as chart from './LanguageChart.utils';



const LanguageChart = (props) =>
{
    const outerRadius = props.height |> chart.computeOuterRadius;
    const innerRadius =outerRadius |>chart.computeInnerRadius;
    const arc = chart.makeArc(innerRadius,outerRadius);
    const arcLine = chart.makeArcLine(innerRadius,outerRadius);
    const DrawnArc =chart.DrawArc(chart.languageChartStyle.colorArc,chart.languageChartStyle.insetshadow1, arc);
    const DrawnArcline =chart.DrawArcLine(props.rate,chart.languageChartStyle.colorArcline,chart.languageChartStyle.insetshadow2,arcLine);
    const DrawnChart =chart.DrawChart(props.language,props.rate,chart.languageChartStyle.colorInnerCircle,innerRadius,chart.languageChartStyle.styleText,DrawnArc,DrawnArcline);

    return DrawnChart;
}
LanguageChart.propTypes = {
    height:PropTypes.number,
    language:PropTypes.string,
    rate:PropTypes.number,
 
}
export default LanguageChart;