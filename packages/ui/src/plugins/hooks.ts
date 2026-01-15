import type { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { concatAST, Kind, type OperationDefinitionNode, visit } from 'graphql';

type OpKind = 'Query' | 'Mutation' | 'Subscription';

export interface ReactApolloCustomPluginConfig {
  withHooks?: boolean;
  withLazy?: boolean;
  withSuspense?: boolean;
  withSubscription?: boolean;
  apolloImportFrom?: string;
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}

export const plugin: PluginFunction<ReactApolloCustomPluginConfig> = (
  _schema,
  documents,
  rawConfig
) => {
  const config: Required<ReactApolloCustomPluginConfig> = {
    withHooks: rawConfig.withHooks ?? true,
    withLazy: rawConfig.withLazy ?? true,
    withSuspense: rawConfig.withSuspense ?? true,
    withSubscription: rawConfig.withSubscription ?? true,
    apolloImportFrom: rawConfig.apolloImportFrom ?? '@apollo/client/react',
  };

  const ast = concatAST(
    documents
      .map((d) => d.document)
      .filter((d): d is NonNullable<typeof d> => Boolean(d))
  );

  type Op = { name: string; kind: OpKind; required: boolean };
  const ops: Op[] = [];

  function hasRequiredVars(node: OperationDefinitionNode) {
    return !!node.variableDefinitions?.some(
      (v) => v.type.kind === Kind.NON_NULL_TYPE && v.defaultValue == null
    );
  }

  visit(ast, {
    OperationDefinition(node: OperationDefinitionNode) {
      if (!node.name) return;
      const name = node.name.value;
      const kind = capitalize(node.operation) as OpKind;
      ops.push({ name, kind, required: hasRequiredVars(node) });
    },
  });

  if (!ops.length) {
    return {
      prepend: [],
      content: `// No operations found. Ensure documents are included in codegen config.`,
    };
  }

  const importLines = [
    `/* Auto-generated — DO NOT EDIT BY HAND */`,
    `/** biome-ignore-all lint: leave this file */`,
    `'use client';`,
    `import * as Apollo from '${config.apolloImportFrom}';`,
    `import * as Graphql from './types';`,
  ].join('\n');

  const defaultOptionsConst = `const defaultOptions = {} as const;`;

  const blocks: string[] = [];

  for (const { name, kind, required } of ops) {
    const resultType = `Graphql.${
      kind === 'Query'
        ? `${name}Query`
        : kind === 'Mutation'
          ? `${name}Mutation`
          : `${name}Subscription`
    }`;
    const varsType = `${resultType}Variables`;
    const documentConst = `Graphql.${name}Document`;

    if (kind === 'Query' && config.withHooks) {
      const queryOpts = `Apollo.useQuery.Options<${resultType}, ${varsType}>`;
      const baseParam = required
        ? `baseOptions: ${queryOpts}`
        : `baseOptions?: ${queryOpts}`;

      blocks.push(
        `
export function use${name}Query(${baseParam}) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useQuery<${resultType}, ${varsType}>(${documentConst}, options);};
export type ${name}QueryHookResult = ReturnType<typeof use${name}Query>;
export type ${name}QueryResult = Apollo.useQuery.Result<${resultType}, ${varsType}>;`.trim()
      );
      if (config.withLazy) {
        blocks.push(
          `
export function use${name}LazyQuery(baseOptions?: Apollo.useLazyQuery.Options<${resultType}, ${varsType}>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useLazyQuery<${resultType}, ${varsType}>(${documentConst}, options);};
export type ${name}LazyQueryHookResult = ReturnType<typeof use${name}LazyQuery>;`.trim()
        );
      }
      if (config.withSuspense) {
        blocks.push(
          `
export function use${name}SuspenseQuery(baseOptions: Apollo.SkipToken | Apollo.useSuspenseQuery.Options<${varsType}>) {const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };return Apollo.useSuspenseQuery<${resultType}, ${varsType}>(${documentConst}, options);};
export type ${name}SuspenseQueryHookResult = ReturnType<typeof use${name}SuspenseQuery>;`.trim()
        );
      }
    }

    if (kind === 'Mutation' && config.withHooks) {
      blocks.push(
        `
export function use${name}Mutation(baseOptions?: Apollo.useMutation.Options<${resultType}, ${varsType}>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useMutation<${resultType}, ${varsType}>(${documentConst}, options);};
export type ${name}MutationHookResult = ReturnType<typeof use${name}Mutation>;
export type ${name}MutationResult = Apollo.useMutation.Result<${resultType}>;`.trim()
      );
    }

    if (
      kind === 'Subscription' &&
      config.withHooks &&
      config.withSubscription
    ) {
      blocks.push(
        `
export function use${name}Subscription(baseOptions?: Apollo.useSubscription.Options<${resultType}, ${varsType}>) {const options = { ...defaultOptions, ...baseOptions };return Apollo.useSubscription<${resultType}, ${varsType}>(${documentConst}, options);};
export type ${name}SubscriptionHookResult = ReturnType<typeof use${name}Subscription>;
export type ${name}SubscriptionResult = Apollo.useSubscription.Result<${resultType}>;`.trim()
      );
    }
  }

  const content = [importLines, defaultOptionsConst, ...blocks].join('\n\n');

  return {
    content,
  };
};

export default { plugin };
