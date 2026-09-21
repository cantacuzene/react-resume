import type { LangContent } from '@/server/content'
import {
  educationFacts,
  experienceFacts,
  linkUrls,
  person,
  spokenLanguageRatings,
} from '@/server/content/shared'

export const fr = {
  resume: {
    profile: {
      ...person,
      jobTitle: 'Architecte logiciel',
      links: [
        { kind: 'GITHUB', url: linkUrls.GITHUB, label: 'Mon profil GitHub' },
        { kind: 'LINKEDIN', url: linkUrls.LINKEDIN, label: 'Mon profil LinkedIn' },
        { kind: 'BADGES', url: linkUrls.BADGES, label: 'Voir mes badges' },
      ],
    },
    about: {
      cover: [
        "Passionné d'informatique depuis ma plus tendre enfance, j'ai non seulement grandi avec les ordinateurs, mais aussi avec le WEB.",
        "C'est donc tout naturellement que je me suis tourné vers des études d'informatiques à l'EPITECH.",
        "Développeur depuis 2007, j'ai touché à plusieurs technologies telles que PHP, JavaScript, ou la stack .NET.",
        "C'est dans cette dernière que je me suis spécialisé, tout en gardant un sens critique exacerbé vis-à-vis des technologies de Microsoft.",
        'Je ne regrette cependant pas mon choix au vu des dernières évolutions de .Net Core',
        "Mes maîtres à penser dans l'industrie viennent de langages et d'horizons différents.",
        "Ils se nomment Martin Fowler, Greg Young, José Valim, Miran Lipovača ou encore Kent Beck pour ne citer qu'eux.",
        "Les sujets qui m'interessent aujourd'hui sont les suivants:",
      ],
      interests: [
        'La programmation fonctionnelle',
        'La DataViz',
        'Les Technologies Front',
        'Le DDD',
        'Le TDD',
        'Les Middleware pipelines',
        'Les architectures micro services et server-less',
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
      { name: 'Architecture hexagonale', rating: 70 },
      { name: 'React', rating: 70 },
      { name: 'Go', rating: 30 },
      { name: 'Ruby', rating: 30 },
      { name: 'Scrum Master', rating: 90 },
      { name: 'Architecture web', rating: 90 },
    ],
    educations: [
      { ...educationFacts.master, title: "Master Expert en Technologies de l'Information" },
      { ...educationFacts.bachelor, title: "Bachelor en Technologies de l'Information" },
    ],
    experiences: [
      {
        ...experienceFacts.karibIt,
        title: 'Architecte logiciel',
        description:
          'Création d’une société de R&D informatique dans le but d’effectuer de la prestation de service auprès d’entreprises locales et internationales',
      },
      {
        ...experienceFacts.zags,
        title: 'Architecte logiciel',
        description:
          "Scrum master, puis Architecte chez un éditeur de logiciel franco-américain spécialisé dans le domaine de l'assurance",
      },
      {
        ...experienceFacts.mgen,
        title: 'Product Owner (responsable produit)',
        description:
          'Mission de maitrise d’ouvrage dans le domaine du recouvrement sur l’ERP Qualiac',
      },
      {
        ...experienceFacts.natixis,
        title: 'Lead développeur',
        description:
          'Lead Developper dans une équipe de 2.5 ETP travaillant sur plusieurs domaines fonctionnels (RH, Référentiel, Déontologie, Juridique, Commercial ) en back office dans le milieu de l’Asset Management.',
      },
      {
        ...experienceFacts.itsGroup,
        title: 'Ingénieur logiciel',
        description:
          'Développement Web et RIA via le CMS OSCAR, Maintenance et évolution des progiciels et sites Web du GIDEC',
      },
      {
        ...experienceFacts.rfo,
        title: 'Stagiaire',
        description:
          'Rédaction d’un audit sur la migration des contrôleurs de domaine du réseau de diffusion de RFO(serveurs en production), et création d’un programme de génération de méta donnée Hrml pour le logiciel chrono-player de Netia (pige antenne)',
      },
    ],
    spokenLanguages: [
      { name: 'Anglais', rating: spokenLanguageRatings.english },
      { name: 'Français', rating: spokenLanguageRatings.french },
    ],
  },
  translations: {
    sections: {
      about: 'À propos',
      skills: 'Compétences',
      education: 'Formation',
      languages: 'Langues',
      experiences: 'Expérience',
    },
    header: { switchTo: 'Changer de langue :', emailMe: 'Écrivez-moi !' },
    timeline: { present: "Aujourd'hui" },
    aria: { switchLanguage: 'Changer de langue', retry: 'Réessayer', loading: 'Chargement' },
  },
  siteLanguages: [
    { code: 'FR', label: 'Français' },
    { code: 'EN', label: 'Anglais' },
  ],
} satisfies LangContent
