import React from 'react';
import {Link} from 'react-router';
const HomePage = () => {
  return (
    <div>
        <header>
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
                        Hugo <img id="myphoto" src="./img/hca.png" /> Cantacuzene
                    </article>

                    <article id="github">
                       <a href="http://github.com/cantacuzene" alt="visit my github page"> <i className="fa fa-github" aria-hidden="true"></i></a><br/>
                       My Github profile
                    </article>
                    <article id="linkedin">
                        <a href="http://linkedin.com/cantacuzene"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a><br/>
                        My Linkedin profile
                    </article>
                    <a href="https://github.com/cantacuzene/react-resume">
                        <img id="githubFlag" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"/>
                    </a>
                </section>
        </header>
          <section id="main">
           <aside id="aside">
            <section className="sub">
                            <h2>
                            About me
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </section>
                        <section className="sub">
                            <h2>
                                    skills
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </section>

                        <section className="sub">
                            <h2>
                                    Education
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </section>
                        <section className="sub">
                            <h2>
                                    Languages
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </section>
            </aside>
            <section className="">
                <h2>
                        Experiences
                </h2>
                <p>
                </p>
            </section>
        </section>
        <footer>
            This page was created thanks to the following projects:
            <ul>
                <li>git</li>
                <li>github</li>
                <li>VS Code</li>
                <li>Atom</li>
                <li>Sass</li>
                <li>Babel</li>
                <li>React</li>
                <li>nodejs</li>
                <li>webpack</li>
                <li>heroku</li>
                <li>12factor</li>
            </ul> 
        </footer>
    </div>
  );
};
export default HomePage;