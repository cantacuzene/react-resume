import LanguageChart from './LanguageChart'
import PropTypes from 'prop-types';
import * as _ from 'ramda';
import {ChartTagDrawer,svgTagDrawer,SectionTagDrawer} from './LanguagesList.utils';


const LanguageList = (props)=> 
{
 
        let TransformDataToChart= _.map(ChartTagDrawer(LanguageChart,props.width,props.height));
        let BuildsvgContainer = svgTagDrawer(props.width,props.height);
        let BuldSectionConainer = SectionTagDrawer(props.Titles,props.chartid);

        return props.Languages
        |> TransformDataToChart
        |> BuildsvgContainer
        |> BuldSectionConainer
}

LanguageList.propTypes = {
    chartid:PropTypes.string,
    width:PropTypes.number,
    height:PropTypes.number,
    Languages:PropTypes.array,
    Titles:PropTypes.object
}
export default LanguageList;