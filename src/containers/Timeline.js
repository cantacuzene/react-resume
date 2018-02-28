import React from 'react'
import TimelineItem from '../components/TimelineItem'

const Timeline = ()=>{
    return(
        <div className="container">
        <section id="timeline">

            <TimelineItem title="Software Architect" company="Zags!" start="04/2015" end="05/2017" 
            description="Scrum master, puis Architecte chez un éditeur de logiciel franco-américain spécialisé dans le domaine de l'assurance" 
            scrum=" suivi de reporting, garant des cérémonies agiles, référent technique et manager d’une équipe de 5 personnes. Maintenance et évolutions sur le scope fonctionnel group life EMEA de la Zags Suite."
            architect="participation à la définition et à la mise en place d’une architecture CQS pour les nouveaux modules basée sur des services Restful combinés à un front React. Participation aux ateliers de définition du besoin fonctionnel. Mise en place des chaines de build/release linux/docker pour dotnet Core et javascript dans VSTS. Référent technique pour les équipes de développement. Javascript & git evangelist."
            stack="asp.Net Mvc 4, .Net 4.5.2, WCF, Visual studio 2015, Roslyn, VSTS, Moq, Xunit, TDD/DDD, OAuth 2.0, Azure, JS, React, Scrum, .Net Core, VS Code, VS 2017, docker, CI/CD, TFS/GIT"/>
             <TimelineItem contentClassName="right" title="Product Owner" company="MGEN" start="07/2014" end="03/2015" description="Lorem Ipsumfsdfsdfsdfsdf  sdfsdfsdf sdfsfdfsd sdfsdfsdfsdf sdfsdfsdfsdf  sdfsdfdsf"/>
              <TimelineItem title="Lead Software Engineer" company="Natixis Asset Management" start="04/2010" end="07/2014" description="Lorem Ipsumfsdfsdfsdfsdf  sdfsdfsdf sdfsfdfsd sdfsdfsdfsdf sdfsdfsdfsdf  sdfsdfdsf"/>
               <TimelineItem title="zags" description="Lorem Ipsumfsdfsdfsdfsdf  sdfsdfsdf sdfsfdfsd sdfsdfsdfsdf sdfsdfsdfsdf  sdfsdfdsf"/>


            
        </section>
        </div>
    );
}

export default Timeline;