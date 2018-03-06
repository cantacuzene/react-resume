import React from 'react';
//import {Link} from 'react-router';
import AboutMe from './AboutMe'
import Skills from './Skills'
//import SpiderWebCharts from './SpiderWebChart'

import Education from './Education'
import Languages from './Languages'
import Experiences from './Experiences'
import HighchartsMore from 'highcharts/highcharts-more';
//import SkillsApi from '../api/SkillsApi'

const HomePage = () => {
  return (
          <section id="main">

            <AboutMe />
            <Skills modules={[HighchartsMore]} container={"polarChart"}/>

            <Education/>
            <Languages chartid={"myd3chart"} width={500} height={190} />
            <Experiences />
        </section>
  );
};
// <SpiderWebCharts width={500} height={500} Data={SkillsApi.get()} />
export default HomePage;