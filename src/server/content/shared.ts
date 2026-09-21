import type { LinkKind } from '@/server/gql/types'

// UTC month start: no timezone can shift the date into the previous month
const month = (year: number, monthNumber: number): Readonly<Date> =>
  new Date(Date.UTC(year, monthNumber - 1, 1))

export const person = {
  name: 'Hugo Cantacuzene',
  location: 'Schoelcher, Martinique',
  email: 'h.cantacuzene@gmail.com',
} as const

export const linkUrls: Readonly<Record<LinkKind, string>> = {
  GITHUB: 'https://github.com/cantacuzene',
  LINKEDIN: 'https://www.linkedin.com/in/hugo-cantacuzene-903b9394',
  BADGES: 'https://backpack.openbadges.org/share/cc71ca2cf7aaf763192d151a1591309f/',
}

export const spokenLanguageRatings = { english: 0.87, french: 1 } as const

export const educationFacts = {
  master: { id: '1', year: 2008, school: 'EPITECH', location: 'Paris, France' },
  bachelor: { id: '0', year: 2006, school: 'EPITECH', location: 'Paris, France' },
} as const

export const experienceFacts = {
  karibIt: {
    id: '5',
    company: 'Karib IT SAS',
    start: month(2018, 1),
    end: null,
    stack: [
      '.NET Core',
      'Python',
      'Django',
      'VS Code',
      'heroku',
      'CI/CD',
      'git',
      'DDD',
      'TDD',
      'React',
      'webpack',
      'babel',
    ],
  },
  zags: {
    id: '4',
    company: 'Zags!',
    start: month(2015, 4),
    end: month(2017, 5),
    stack: [
      'Asp.NET Mvc 4',
      '.NET 4.5.2',
      'WCF',
      'Visual studio 2015',
      'Roslyn',
      'VSTS',
      'Moq',
      'Xunit',
      'TDD/DDD',
      'OAuth 2.0',
      'Azure',
      'JS',
      'React',
      'Scrum',
      '.NET Core',
      'VS Code',
      'VS 2017',
      'docker',
      'CI/CD',
      'TFS',
      'git',
      'webpack',
      'babel',
    ],
  },
  mgen: {
    id: '3',
    company: 'MGEN',
    start: month(2014, 7),
    end: month(2015, 3),
    stack: ['Oracle Sql Developer', 'Linqpad', 'Linq', 'c# 4.0', 'php 5', 'Oracle 10g', 'Qualiac'],
  },
  natixis: {
    id: '2',
    company: 'Natixis Asset Management',
    start: month(2010, 4),
    end: month(2014, 7),
    stack: [
      'Visual Studio 2010',
      'SQL Server',
      'RedGate Ants',
      'TDD',
      'Teamcity',
      'FXcop',
      'SVN',
      'Resharper',
      'Nunit',
      'MsTest',
      'WCF',
      'Javascript',
      'IIS',
      '.NET 4',
      'Linq',
      'ASP.Net',
      'MVC',
      'JQuery',
      'C#',
      'EF',
    ],
  },
  itsGroup: {
    id: '1',
    company: 'ITS Group',
    start: month(2007, 12),
    end: month(2010, 4),
    stack: [
      'php 5.x',
      'SQL server 2000',
      'Asp',
      'Apache 2',
      'MySQL 5.x',
      'LAMP Gupta 3.1',
      'Asp .NET 1.1.4',
      'Workflow fundation',
      '.NET 3.5',
      'Linq to SQL',
    ],
  },
  rfo: {
    id: '0',
    company: 'France Télévision (R.F.O.)',
    start: month(2006, 5),
    end: month(2006, 10),
    stack: ['.NET 2.0', 'Traffic', 'Oracle', 'Active Directory', 'Windows server 2003'],
  },
} as const
