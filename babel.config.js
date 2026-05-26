const fs = require('fs')

const getEnvFile = () => {
  if (process.env.ENVFILE) {
    return process.env.ENVFILE
  }

  try {
    return fs.readFileSync('/tmp/envfile', 'utf8').trim() || '.env'
  } catch {
    return '.env'
  }
}

module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'babel-plugin-dotenv-import',
      {
        moduleName: '@env',
        path: getEnvFile(),
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-worklets/plugin',
  ],
  env: {
    production: {
      plugins: [['transform-remove-console']],
    },
  },
}
