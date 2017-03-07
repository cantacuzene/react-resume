import React from 'react';
import {Link} from 'react-router';
import AboutMe from './AboutMe'
import Skills from './Skills'
import SpiderWebCharts from './SpiderWebChart'

import Education from './Education'
import Languages from './Languages'
import Experiences from './Experiences'
import HighchartsMore from 'highcharts/highcharts-more';

const HomePage = () => {
  return (
          <section id="main">
           <aside id="aside">
            <AboutMe />
            <Skills modules={[HighchartsMore]} container={"polarChart"}/>
            <SpiderWebCharts width={500} height={590} />
            <Education/>
            <Languages chartid={"myd3chart"} width={500} height={190} />
            </aside>
            <Experiences />
        </section>
  );
};
export default HomePage;