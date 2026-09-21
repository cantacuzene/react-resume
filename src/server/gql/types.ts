import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
};

export type About = {
  readonly __typename?: 'About';
  readonly cover: ReadonlyArray<Scalars['String']['output']>;
  readonly interests: ReadonlyArray<Scalars['String']['output']>;
};

export type AriaLabels = {
  readonly __typename?: 'AriaLabels';
  readonly loading: Scalars['String']['output'];
  readonly retry: Scalars['String']['output'];
  readonly switchLanguage: Scalars['String']['output'];
};

export type Education = {
  readonly __typename?: 'Education';
  readonly id: Scalars['ID']['output'];
  readonly location: Scalars['String']['output'];
  readonly school: Scalars['String']['output'];
  readonly title: Scalars['String']['output'];
  readonly year: Scalars['Int']['output'];
};

export type Experience = {
  readonly __typename?: 'Experience';
  readonly company: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  /** null means the current position */
  readonly end?: Maybe<Scalars['Date']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly stack: ReadonlyArray<Scalars['String']['output']>;
  readonly start: Scalars['Date']['output'];
  readonly title: Scalars['String']['output'];
};

export type HeaderLabels = {
  readonly __typename?: 'HeaderLabels';
  readonly emailMe: Scalars['String']['output'];
  readonly switchTo: Scalars['String']['output'];
};

export type Lang =
  | 'EN'
  | 'FR';

export type LinkKind =
  | 'BADGES'
  | 'GITHUB'
  | 'LINKEDIN';

export type Profile = {
  readonly __typename?: 'Profile';
  readonly email: Scalars['String']['output'];
  readonly jobTitle: Scalars['String']['output'];
  readonly links: ReadonlyArray<ProfileLink>;
  readonly location: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
};

export type ProfileLink = {
  readonly __typename?: 'ProfileLink';
  readonly kind: LinkKind;
  /** Translated, e.g. "My GitHub profile" */
  readonly label: Scalars['String']['output'];
  readonly url: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly resume: Resume;
  readonly siteLanguages: ReadonlyArray<SiteLanguage>;
  readonly translations: Translations;
};


export type QueryResumeArgs = {
  lang: Lang;
};


export type QuerySiteLanguagesArgs = {
  lang: Lang;
};


export type QueryTranslationsArgs = {
  lang: Lang;
};

export type Resume = {
  readonly __typename?: 'Resume';
  readonly about: About;
  readonly educations: ReadonlyArray<Education>;
  readonly experiences: ReadonlyArray<Experience>;
  readonly profile: Profile;
  readonly skills: ReadonlyArray<Skill>;
  readonly spokenLanguages: ReadonlyArray<SpokenLanguage>;
};

export type SectionTitles = {
  readonly __typename?: 'SectionTitles';
  readonly about: Scalars['String']['output'];
  readonly education: Scalars['String']['output'];
  readonly experiences: Scalars['String']['output'];
  readonly languages: Scalars['String']['output'];
  readonly skills: Scalars['String']['output'];
};

export type SiteLanguage = {
  readonly __typename?: 'SiteLanguage';
  readonly code: Lang;
  /** In the requested language, e.g. lang FR gives "Anglais" for EN */
  readonly label: Scalars['String']['output'];
};

export type Skill = {
  readonly __typename?: 'Skill';
  readonly name: Scalars['String']['output'];
  /** 0–100 */
  readonly rating: Scalars['Int']['output'];
};

export type SpokenLanguage = {
  readonly __typename?: 'SpokenLanguage';
  readonly name: Scalars['String']['output'];
  /** 0–1 */
  readonly rating: Scalars['Float']['output'];
};

export type TimelineLabels = {
  readonly __typename?: 'TimelineLabels';
  /** Shown when Experience.end is null */
  readonly present: Scalars['String']['output'];
};

export type Translations = {
  readonly __typename?: 'Translations';
  readonly aria: AriaLabels;
  readonly header: HeaderLabels;
  readonly sections: SectionTitles;
  readonly timeline: TimelineLabels;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  About: ResolverTypeWrapper<About>;
  AriaLabels: ResolverTypeWrapper<AriaLabels>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Education: ResolverTypeWrapper<Education>;
  Experience: ResolverTypeWrapper<Experience>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HeaderLabels: ResolverTypeWrapper<HeaderLabels>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Lang: Lang;
  LinkKind: LinkKind;
  Profile: ResolverTypeWrapper<Profile>;
  ProfileLink: ResolverTypeWrapper<ProfileLink>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Resume: ResolverTypeWrapper<Resume>;
  SectionTitles: ResolverTypeWrapper<SectionTitles>;
  SiteLanguage: ResolverTypeWrapper<SiteLanguage>;
  Skill: ResolverTypeWrapper<Skill>;
  SpokenLanguage: ResolverTypeWrapper<SpokenLanguage>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TimelineLabels: ResolverTypeWrapper<TimelineLabels>;
  Translations: ResolverTypeWrapper<Translations>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  About: About;
  AriaLabels: AriaLabels;
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Education: Education;
  Experience: Experience;
  Float: Scalars['Float']['output'];
  HeaderLabels: HeaderLabels;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Profile: Profile;
  ProfileLink: ProfileLink;
  Query: Record<PropertyKey, never>;
  Resume: Resume;
  SectionTitles: SectionTitles;
  SiteLanguage: SiteLanguage;
  Skill: Skill;
  SpokenLanguage: SpokenLanguage;
  String: Scalars['String']['output'];
  TimelineLabels: TimelineLabels;
  Translations: Translations;
};

export type AboutResolvers<ContextType = any, ParentType extends ResolversParentTypes['About'] = ResolversParentTypes['About']> = {
  cover?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType>;
  interests?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AriaLabelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AriaLabels'] = ResolversParentTypes['AriaLabels']> = {
  loading?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  retry?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  switchLanguage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EducationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Education'] = ResolversParentTypes['Education']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  school?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ExperienceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Experience'] = ResolversParentTypes['Experience']> = {
  company?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stack?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type HeaderLabelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['HeaderLabels'] = ResolversParentTypes['HeaderLabels']> = {
  emailMe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  switchTo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  links?: Resolver<ReadonlyArray<ResolversTypes['ProfileLink']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ProfileLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileLink'] = ResolversParentTypes['ProfileLink']> = {
  kind?: Resolver<ResolversTypes['LinkKind'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  resume?: Resolver<ResolversTypes['Resume'], ParentType, ContextType, RequireFields<QueryResumeArgs, 'lang'>>;
  siteLanguages?: Resolver<ReadonlyArray<ResolversTypes['SiteLanguage']>, ParentType, ContextType, RequireFields<QuerySiteLanguagesArgs, 'lang'>>;
  translations?: Resolver<ResolversTypes['Translations'], ParentType, ContextType, RequireFields<QueryTranslationsArgs, 'lang'>>;
};

export type ResumeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Resume'] = ResolversParentTypes['Resume']> = {
  about?: Resolver<ResolversTypes['About'], ParentType, ContextType>;
  educations?: Resolver<ReadonlyArray<ResolversTypes['Education']>, ParentType, ContextType>;
  experiences?: Resolver<ReadonlyArray<ResolversTypes['Experience']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  skills?: Resolver<ReadonlyArray<ResolversTypes['Skill']>, ParentType, ContextType>;
  spokenLanguages?: Resolver<ReadonlyArray<ResolversTypes['SpokenLanguage']>, ParentType, ContextType>;
};

export type SectionTitlesResolvers<ContextType = any, ParentType extends ResolversParentTypes['SectionTitles'] = ResolversParentTypes['SectionTitles']> = {
  about?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  education?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  experiences?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  languages?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SiteLanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SiteLanguage'] = ResolversParentTypes['SiteLanguage']> = {
  code?: Resolver<ResolversTypes['Lang'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SkillResolvers<ContextType = any, ParentType extends ResolversParentTypes['Skill'] = ResolversParentTypes['Skill']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SpokenLanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpokenLanguage'] = ResolversParentTypes['SpokenLanguage']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type TimelineLabelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimelineLabels'] = ResolversParentTypes['TimelineLabels']> = {
  present?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TranslationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Translations'] = ResolversParentTypes['Translations']> = {
  aria?: Resolver<ResolversTypes['AriaLabels'], ParentType, ContextType>;
  header?: Resolver<ResolversTypes['HeaderLabels'], ParentType, ContextType>;
  sections?: Resolver<ResolversTypes['SectionTitles'], ParentType, ContextType>;
  timeline?: Resolver<ResolversTypes['TimelineLabels'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  About?: AboutResolvers<ContextType>;
  AriaLabels?: AriaLabelsResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Education?: EducationResolvers<ContextType>;
  Experience?: ExperienceResolvers<ContextType>;
  HeaderLabels?: HeaderLabelsResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  ProfileLink?: ProfileLinkResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Resume?: ResumeResolvers<ContextType>;
  SectionTitles?: SectionTitlesResolvers<ContextType>;
  SiteLanguage?: SiteLanguageResolvers<ContextType>;
  Skill?: SkillResolvers<ContextType>;
  SpokenLanguage?: SpokenLanguageResolvers<ContextType>;
  TimelineLabels?: TimelineLabelsResolvers<ContextType>;
  Translations?: TranslationsResolvers<ContextType>;
};

