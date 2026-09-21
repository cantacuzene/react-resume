import React from 'react'
import {PropTypes} from 'prop-types'

const Header = (props) => {
    //console.log(props.languages);
   const langs= props.Config.languages.filter(x=>x.selected==false).map((x)=>{
return (<a href='#' key={x.id} onClick={()=>props.changeLanguage(x.code)}><span className={`flag-icon flag-icon-${x.code=='en'?'us':x.code} grayscale left`}  ></span></a>)});
    return (
        <header>
            <div className='topMenu'>
            Switch to:
            {langs}
            <div className='right'>
                <span><a>me</a></span>
                <span><a>blog</a></span>
                <span><a>karib.it</a></span>
            </div>
            </div>
            <nav>
                <section id="email">
                    <a href="mailto:(h.cantacuzene@gmail.com)" alt="send me an email">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                        <br/>Email me!
                    </a>
                </section>
                <section id="badges">
                    <a
                        href="https://backpack.openbadges.org/share/cc71ca2cf7aaf763192d151a1591309f/"
                        alt="visit my openbadge page">
                        <i className="fa fa-certificate" aria-hidden="true"></i><br/>
                        View my badges
                    </a>
                </section>
                <section>
                    <a href="http://github.com/cantacuzene" alt="visit my github page">
                        <i className="fa fa-github" aria-hidden="true"></i><br/>
                        My Github profile
                    </a>

                </section>
                <section>
                    <a href="https://www.linkedin.com/in/hugo-cantacuzene-903b9394">
                        <i className="fa fa-linkedin-square" aria-hidden="true"></i>
                        <br/>My Linkedin profile
                    </a>
                </section>
                <section id="me">
                    {/* <img  src="./img/hca.png" /><br/> */}
                    Hugo Cantacuzene
                    <h5>Software Architect</h5>
                    <i>Schoelcher, Martinique</i>
                </section>
            </nav>
        </header>
    );
}
Header.propTypes ={
    Config: PropTypes.object,
    changeLanguage:PropTypes.func.isRequired
}
export default Header;
