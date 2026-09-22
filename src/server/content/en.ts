import type { LangContent } from '@/server/content'
import {
  educationFacts,
  experienceFacts,
  linkUrls,
  person,
  spokenLanguageRatings,
} from '@/server/content/shared'

export const en = {
  resume: {
    profile: {
      ...person,
      jobTitle: 'Software Architect',
      links: [
        { kind: 'GITHUB', url: linkUrls.GITHUB, label: 'My GitHub profile' },
        { kind: 'LINKEDIN', url: linkUrls.LINKEDIN, label: 'My LinkedIn profile' },
        { kind: 'BADGES', url: linkUrls.BADGES, label: 'View my badges' },
      ],
    },
    about: {
      cover: [
        "Since I was a toddler I've always loved computer science. Not only was I surrounded by computers but I also grew up with the world wide web.",
        'By the time I graduated, choosing a major was an easy choice. I had to study computer science at EPITECH',
        "Working in the software industry since 2007, I've used several technologies such as PHP, JavaScript, or the .NET stack.",
        'I chose to specialise in the latter, but still kept a critical mindset toward Microsoft technologies.',
        "After a few years and knowing where .NET Core is headed, I'm glad I made this choice.",
        'I am influenced by people with very different background in the industry. Folks like Martin Fowler, Greg Young, José Valim, Miran Lipovača or Kent Beck.',
        "The practices I'm particularly  keen on these days are:",
      ],
      interests: [
        'Functional programing',
        'DataViz',
        'Front-end Technologies',
        'DDD',
        'TDD',
        'Middleware pipelines',
        'Micro services and server-less architectures',
      ],
    },
    skills: [
      { name: 'C#', rating: 90 },
      { name: 'HTML', rating: 80 },
      { name: 'CSS', rating: 70 },
      { name: 'JS', rating: 80 },
      { name: 'Docker', rating: 60 },
      { name: 'SQL', rating: 70 },
      { name: 'Linux', rating: 60 },
      { name: 'dotnet core', rating: 60 },
      { name: 'Hexagonal Architecture', rating: 70 },
      { name: 'React', rating: 70 },
      { name: 'Go', rating: 30 },
      { name: 'Ruby', rating: 30 },
      { name: 'Scrum Master', rating: 90 },
      { name: 'Web Architecture', rating: 90 },
    ],
    educations: [
      { ...educationFacts.master, title: 'Master: Expert in Information Technologies' },
      { ...educationFacts.bachelor, title: 'Bachelor in Information Technologies' },
    ],
    experiences: [
      {
        ...experienceFacts.karibIt,
        title: 'Software Architect',
        description:
          'Created a R&D software company which aims to provide consulting services for Caribbean or north American businesses',
      },
      {
        ...experienceFacts.zags,
        title: 'Software Architect',
        description:
          'Worked as a Scrum master, then as a software Architect in a french-american insurance software company, contracting for Microsoft Services and AXA on a 1 000 000+ codebase.',
      },
      {
        ...experienceFacts.mgen,
        title: 'Product Owner',
        description:
          'Product owner in the functional design team for debt-collection domain on Qualiac ERP.',
      },
      {
        ...experienceFacts.natixis,
        title: 'Lead Software Engineer',
        description:
          'Lead Developper in a 2.5 FTE team. Worked on several functional domains for back office applications in an Asset management company (HR, Repository, Deontology, Legal, Sales ).',
      },
      {
        ...experienceFacts.itsGroup,
        title: 'Software Engineer',
        description:
          'Development of rich internet application with OSCAR CMS,designed and implemented evolutions of the GIDEC Web sites and softwares',
      },
      {
        ...experienceFacts.rfo,
        title: 'Intern',
        description:
          'Active directory Domain controler re-design of the broadcasting network at RFO',
      },
    ],
    spokenLanguages: [
      { name: 'English', rating: spokenLanguageRatings.english },
      { name: 'French', rating: spokenLanguageRatings.french },
    ],
  },
  translations: {
    sections: {
      about: 'About',
      skills: 'Skills',
      education: 'Education',
      languages: 'Languages',
      experiences: 'Experience',
    },
    header: { switchTo: 'Switch to:', emailMe: 'Email me!' },
    timeline: { present: 'Present', description: 'Description', stack: 'Stack' },
    aria: { switchLanguage: 'Switch language', retry: 'Retry', loading: 'Loading' },
  },
  siteLanguages: [
    { code: 'FR', label: 'French' },
    { code: 'EN', label: 'English' },
  ],
} satisfies LangContent
