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
             <TimelineItem contentClassName="right" title="Product Owner" company="MGEN" start="07/2014" end="03/2015" 
             description="Mission de maitrise d’ouvrage dans le domaine du recouvrement sur l’ERP Qualiac"
             operations="rédaction de spécifications fonctionnelles , recette et création de scripts d’automatisations de tâches récurrentes."
                stack="Oracle Sql Developer, Linqpad, Linq, c# 4.0, php 5, Oracle 10g, Qualiac"
             />
              <TimelineItem title="Lead Software Engineer" company="Natixis Asset Management" start="04/2010" end="07/2014" 
              description="Lead Developper dans une équipe de 2.5 ETP travaillant sur plusieurs domaines fonctionnels (RH, Référentiel, Déontologie, Juridique, Commercial ) en back office dans le milieu de l’Asset Management."
              operations="Rédaction de dossier d’architecture pour la mise en place des projets. Rédaction de spécifications techniques, création, et TMA sur plusieurs projets ASP.Net et services WCF. Réfèrent technique lors des appels d’offres mobilité et refonte des sites institutionnels."
              stack="Visual Studio 2010, SQL Server, RedGate Ants, TDD, Teamcity, FXcop, SVN, Resharper, Nunit, MsTest, WCF, Javascript, IIS .Net 4, WCF, Linq, ASP.Net, MVC, JQuery, C#, EF"
              />
               <TimelineItem contentClassName="right" title="ITS Group" start="12/2007" end="04/2010" 
               description="Développement Web et RIA via le CMS OSCAR, Maintenance et évolution des progiciels et sites Web du GIDEC"
               operations="Refonte du système de génération de commandes du GIDEC. Coordination des équipes d’hébergement d’intégra et de Hotline de Spinea pour le GIDEC."
               stack="php 5.x, SQL server 2000, Asp, Apache 2, MySQL 5.x, LAMP Gupta 3.1, SQL server 2000, Asp .NET 1.1.4, Workflow fundation, .net 3.5, Linq to SQL"
               />
               <TimelineItem title="France Télévision (R.F.O.)" start="05/2006" end="10/2006" 
               description="Rédaction d’un audit sur la migration des contrôleurs de domaine du réseau de diffusion de RFO(serveurs en production), et création d’un programme de génération de méta donnée Hrml pour le logiciel chrono-player de Netia (pige antenne)"
                stack="Net 2.0, Traffic , Oracle, Active Directory, Windows server 2003 "
               />


            
        </section>
        </div>
    );
}

export default Timeline;