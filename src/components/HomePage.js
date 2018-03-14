import React from 'react';
import AboutMe from './AboutMe'
import Skills from './Skills'
import Education from './Education'
import LanguageList from './Languages'
import Experiences from './Experiences'
import HighchartsMore from 'highcharts/highcharts-more';

const HomePage = (props) => {
  return (
          <section id="main">

            <AboutMe />
            <Skills modules={[HighchartsMore]} container={"polarChart"}/>

            <Education/>
            <LanguageList chartid={"myd3chart"} width={500} height={190} Languages={props.Languages}/>
            <Experiences />
        </section>
  );
};
export default HomePage;