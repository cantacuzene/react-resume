import React from 'react';
import AboutMe from './AboutMe'
import Skills from './Skills'
import Education from './Education'
import LanguageList from './LanguagesList'
import Experiences from './Experiences'
import HighchartsMore from 'highcharts/highcharts-more';
import PropTypes from 'prop-types';

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
HomePage.propTypes = {
  Languages:PropTypes.array
}
export default HomePage;