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
            <Skills modules={[HighchartsMore]} container={"polarChart"} Skills={props.Skills}/>

            <Education/>
            <LanguageList chartid={"myd3chart"} width={500} height={190} Languages={props.Languages}/>
            <Experiences Experiences={props.Experiences} />
        </section>
  );
};
HomePage.propTypes = {
  Languages:PropTypes.array,
  Skills:PropTypes.object,
  Experiences:PropTypes.array
}
export default HomePage;