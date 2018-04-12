import React from 'react'
import * as _ from 'ramda';

export let ChartTagDrawer= _.curry( 
    (LanguageChart,width,height,language) =><LanguageChart key={language?.id} language={language?.name} rate={language?.rating} width={width} height={height} />
);

export let svgTagDrawer = _.curry(
    (width,height,ChartTagDrawer) =>
    <svg  className="svg-content-responsive" preserveAspectRatio="xMinYMax meet" viewBox={`0 0 ${width} ${height}`}>
    {ChartTagDrawer}
    </svg>
);

export let SectionTagDrawer = _.curry(
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