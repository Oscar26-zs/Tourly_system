import 'react-i18next';

// Minimal type augmentation for react-i18next to avoid TS errors while we
// progressively type the translation resources. This gives a typed
// default namespace and a generic resources shape. Later we can replace
// `Record<string, any>` with the exact shape imported from the JSON files
// (requires `resolveJsonModule` in tsconfig) to get full autocomplete.

declare module 'react-i18next' {
  interface CustomTypeOptions {
    // default namespace used in your project
    defaultNS: 'translation';
    // shape of resources; make it permissive for now
    resources: {
      translation: Record<string, any>;
    };
  }
}
