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

            <AboutMe cover={props.Abouts.cover} interests={props.Abouts.interests} Titles={props.Titles}/>
            <Skills modules={[HighchartsMore]} container={"polarChart"} Skills={props.Skills} Titles={props.Titles}/>

            <Education Educations={props.Educations} Titles={props.Titles}/>
            <LanguageList chartid={"myd3chart"} width={500} height={190} Languages={props.Languages} Titles={props.Titles}/>
            <Experiences Experiences={props.Experiences} Titles={props.Titles}/>
        </section>
  );
};
HomePage.propTypes = {
  Languages:PropTypes.array,
  Skills:PropTypes.object,
  Experiences:PropTypes.array,
  Educations:PropTypes.array,
  Titles:PropTypes.object,
  Abouts:PropTypes.object
}
export default HomePage;