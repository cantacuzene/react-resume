import React from 'react';
import {Link} from 'react-router';
import AboutMe from './AboutMe'
import Skills from './Skills'
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
            <Education/>
            <Languages/>
            </aside>
            <Experiences />
        </section>
  );
};
export default HomePage;