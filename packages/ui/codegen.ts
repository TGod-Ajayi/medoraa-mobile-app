import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4200/graphql',
  documents: './src/graphql/modules/**/*.gql',
  generates: {
    './src/graphql/modules/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
    },
    './src/graphql/modules/hooks.ts': {
      plugins: ['./src/plugins/hooks.ts'],
    },
  },
};
export default config;
