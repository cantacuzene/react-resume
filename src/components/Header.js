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
                        <img  src="./img/hca.png" /> <br/>Hugo Cantacuzene
                    </section>
            </nav>

            {/*
                <section id="contact2">
                    <article id="email">
                       <a href="mailto:(h.cantacuzene@gmail.com)" alt="send me an email"><i className="fa fa-envelope" aria-hidden="true"></i><br/></a>
                       Email me!
                    </article>
                    <article id="bages">
                        <a href="https://backpack.openbadges.org/share/cc71ca2cf7aaf763192d151a1591309f/" alt="visit my openbadge page"><i className="fa fa-certificate" aria-hidden="true"></i></a><br/>
                        View my badges
                    </article>

                    <article id="name2">
                        <img id="myphoto" src="./img/hca.png" /> <br/>Hugo Cantacuzene
                    </article>

                    <article id="github">
                       <a href="http://github.com/cantacuzene" alt="visit my github page"> <i className="fa fa-github" aria-hidden="true"></i></a><br/>
                       My Github profile
                    </article>
                    <article id="linkedin">
                        <a href="https://www.linkedin.com/in/hugo-cantacuzene-903b9394"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a><br/>
                        My Linkedin profile
                    </article>
                    <a href="https://github.com/cantacuzene/react-resume">
                        <img id="githubFlag" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"/>
                    </a>
                </section>
            */}
        </header>
    );
}


export default Header;
