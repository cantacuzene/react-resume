import React from 'react'



const Header  = ()=>{
    return(
        <header>
            <nav>
                    <section id="email">
                        <a href="mailto:(h.cantacuzene@gmail.com)" alt="send me an email">
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            <br/>Email me!
                        </a>
                    </section>
                    <section id="badges">
                        <a href="https://backpack.openbadges.org/share/cc71ca2cf7aaf763192d151a1591309f/" alt="visit my openbadge page">
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
                    <section id ="me">
                        {/* <img  src="./img/hca.png" /><br/> */}
                        Hugo Cantacuzene
                        <h5>Software Architect</h5>
                    </section>
            </nav>
        </header>
    );
}


export default Header;
