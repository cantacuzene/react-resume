/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query ResumePage($lang: Lang!) {\n    resume(lang: $lang) {\n      profile {\n        name\n        jobTitle\n        location\n        email\n        links {\n          kind\n          url\n          label\n        }\n      }\n      about {\n        cover\n        interests\n      }\n      skills {\n        name\n        rating\n      }\n      educations {\n        id\n        year\n        school\n        location\n        title\n      }\n      experiences {\n        id\n        title\n        company\n        start\n        end\n        description\n        stack\n      }\n      spokenLanguages {\n        name\n        rating\n      }\n    }\n    translations(lang: $lang) {\n      sections {\n        about\n        skills\n        education\n        languages\n        experiences\n      }\n      header {\n        switchTo\n        emailMe\n      }\n      timeline {\n        present\n        description\n        stack\n      }\n      aria {\n        switchLanguage\n        retry\n        loading\n      }\n    }\n    siteLanguages(lang: $lang) {\n      code\n      label\n    }\n  }\n": typeof types.ResumePageDocument,
};
const documents: Documents = {
    "\n  query ResumePage($lang: Lang!) {\n    resume(lang: $lang) {\n      profile {\n        name\n        jobTitle\n        location\n        email\n        links {\n          kind\n          url\n          label\n        }\n      }\n      about {\n        cover\n        interests\n      }\n      skills {\n        name\n        rating\n      }\n      educations {\n        id\n        year\n        school\n        location\n        title\n      }\n      experiences {\n        id\n        title\n        company\n        start\n        end\n        description\n        stack\n      }\n      spokenLanguages {\n        name\n        rating\n      }\n    }\n    translations(lang: $lang) {\n      sections {\n        about\n        skills\n        education\n        languages\n        experiences\n      }\n      header {\n        switchTo\n        emailMe\n      }\n      timeline {\n        present\n        description\n        stack\n      }\n      aria {\n        switchLanguage\n        retry\n        loading\n      }\n    }\n    siteLanguages(lang: $lang) {\n      code\n      label\n    }\n  }\n": types.ResumePageDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ResumePage($lang: Lang!) {\n    resume(lang: $lang) {\n      profile {\n        name\n        jobTitle\n        location\n        email\n        links {\n          kind\n          url\n          label\n        }\n      }\n      about {\n        cover\n        interests\n      }\n      skills {\n        name\n        rating\n      }\n      educations {\n        id\n        year\n        school\n        location\n        title\n      }\n      experiences {\n        id\n        title\n        company\n        start\n        end\n        description\n        stack\n      }\n      spokenLanguages {\n        name\n        rating\n      }\n    }\n    translations(lang: $lang) {\n      sections {\n        about\n        skills\n        education\n        languages\n        experiences\n      }\n      header {\n        switchTo\n        emailMe\n      }\n      timeline {\n        present\n        description\n        stack\n      }\n      aria {\n        switchLanguage\n        retry\n        loading\n      }\n    }\n    siteLanguages(lang: $lang) {\n      code\n      label\n    }\n  }\n"): (typeof documents)["\n  query ResumePage($lang: Lang!) {\n    resume(lang: $lang) {\n      profile {\n        name\n        jobTitle\n        location\n        email\n        links {\n          kind\n          url\n          label\n        }\n      }\n      about {\n        cover\n        interests\n      }\n      skills {\n        name\n        rating\n      }\n      educations {\n        id\n        year\n        school\n        location\n        title\n      }\n      experiences {\n        id\n        title\n        company\n        start\n        end\n        description\n        stack\n      }\n      spokenLanguages {\n        name\n        rating\n      }\n    }\n    translations(lang: $lang) {\n      sections {\n        about\n        skills\n        education\n        languages\n        experiences\n      }\n      header {\n        switchTo\n        emailMe\n      }\n      timeline {\n        present\n        description\n        stack\n      }\n      aria {\n        switchLanguage\n        retry\n        loading\n      }\n    }\n    siteLanguages(lang: $lang) {\n      code\n      label\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;