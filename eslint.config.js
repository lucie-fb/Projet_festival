import pluginVue from 'eslint-plugin-vue';

export default [
  ...pluginVue.configs['flat/essential'],
  {
    ignores: [
      '.nuxt/',
      '.output/',
      'dist/',
      'node_modules/'
    ]
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Désactive la règle exigeant plusieurs mots pour les composants (ex: Header.vue, Button.vue)
      'no-unused-vars': 'warn',
      'no-undef': 'off' // Les auto-imports de Nuxt provoquent de fausses alertes d'indéfinition
    }
  }
];