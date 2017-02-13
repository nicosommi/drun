/* ph stamps */
/* /^(?!expressWebServer)(?!eslintLinting)(?!reactMochaEnzyme)(?!webpackWithDevServer)(?!styledComponents).*$/ */
/* endph */

let packageObject = {
  babel: {
    presets: ['es2015', 'stage-2']
  },
  dependencies: {
  },
  devDependencies: {
    gddify: '^0.1.4',
    'babel-cli': '^6.22.2',
    'babel-polyfill': '^6.9.1',
    'babel-preset-es2015': '^6.9.0',
    'babel-preset-stage-2': '^6.18.0',
    'babel-register': '^6.9.0',
    'babel-require': '^1.0.1',
    'cross-env': '^3.1.3',
    'shx': '^0.2.2'
  },
  scripts: {
    gddify: 'gddify',
    build: 'shx rm -fr dist && babel src -d dist'
  },
  author: 'nicosommi',
  license: 'MIT'
}

/* ph customPackage */
packageObject = {
  ...packageObject,
  name: 'drun',
  version: '0.0.3',
  description: 'containerized run of scripts',
  bin: 'dist/bin/drun.js',
  repository: {
    type: 'git',
    url: 'ssh://github.com/nicosommi/drun.git'
  },
  dependencies: {
    ...packageObject.dependencies,
    debug: '^2.2.0',
    'yargs': '^6.6.0',
    'find-up': '^2.1.0'
  },
  devDependencies: {
    ...packageObject.devDependencies
  },
  // yes, I also use myself and that is conceptually correct
  // except for the watch task which is just for testing purposes
  scripts: {
    ...packageObject.scripts,
    'drun': 'node dist/bin/drun.js',
    'drun:watch': "watch 'node dist/bin/drun.js check' src"
  },
  'drun': {
    'default': {
      'image': 'node:alpine'
    },
    'customnoitty': {
      'interactive': false,
      'tty': false
    },
    'customnoi': {
      'interactive': false,
      'tty': true
    },
    'customnotty': {
      'interactive': true,
      'tty': false
    },
    'custom': {
      'image': 'node',
      'workingDirectory': '/src',
      'commandType': 'raw',
      'interactive': true,
      'tty': true,
      'ports': {
        '9000': '80'
      },
      'volumes': {
        './': '/src',
        '/home': '/home'
      }
    }
  }
}
/* endph */

/* stamp expressWebServer */
/* endstamp */

/* stamp mochaTesting */
packageObject = {
  ...packageObject,
  devDependencies: {
    ...packageObject.devDependencies,
    mocha: '^2.5.3',
    nyc: '^10.0.0',
    proxyquire: '^1.7.10',
    watch: '^0.19.1'
  },
  scripts: {
    ...packageObject.scripts,
    test: 'cross-env NODE_ENV=test nyc --reporter=text-summary mocha \'src/**/*.test.js\' --require mocha.setup.js',
    // 'test:watch': 'cross-env NODE_ENV=test watch \'nyc --reporter=text-summary mocha "src/**/*.test.js" --require mocha.setup.js\' --reporter min src --ignoreDotFiles',
    'test:watch': 'cross-env NODE_ENV=test nyc --reporter=text-summary mocha "src/**/*.test.js" --require mocha.setup.js --reporter min --watch',
    coverage: 'cross-env NODE_ENV=test nyc mocha \'src/**/*.test.js\' --require mocha.setup.js',
    // 'coverage:watch': 'cross-env NODE_ENV=test watch \'nyc mocha "src/**/*.test.js" --require mocha.setup.js\' src --ignoreDotFiles'
    'coverage:watch': 'cross-env NODE_ENV=test nyc mocha \'src/**/*.test.js\' --require mocha.setup.js --watch --reporter min'
  }
}
/* endstamp */

/* stamp reactMochaEnzyme */
/* endstamp */

/* stamp webpackWithDevServer */
/* endstamp */

/* stamp styledComponents */
/* endstamp */

/* stamp nycEnforceCoverage */
packageObject = {
  ...packageObject,
  nyc: {
    lines: 90,
    statements: 90,
    functions: 90,
    branches: 90,
    sourceType: 'module',
    include: [
      'src/**/*.js'
    ],
    exclude: [
      'src/**/*.test.js'
    ],
    reporter: [
      'lcov',
      'text',
      'html'
    ],
    require: [
      'babel-register'
    ],
    extension: [
      '.js'
    ],
    cache: true,
    all: true,
    'check-coverage': true,
    'report-dir': './.coverage'
  }
}
/* endstamp */

/* stamp expectAssertions */
packageObject = {
  ...packageObject,
  devDependencies: {
    ...packageObject.devDependencies,
    expect: '^1.20.2'
  }
}
/* endstamp */

/* stamp nspPackageManagement */
packageObject = {
  ...packageObject,
  dependencies: {
    ...packageObject.dependencies,
    nsp: '^2.6.2'
  },
  scripts: {
    ...packageObject.scripts,
    check: 'nsp check'
  }
}
/* endstamp */

/* stamp eslintLinting */
/* endstamp */

/* stamp standardLinting */
packageObject = {
  ...packageObject,
  devDependencies: {
    ...packageObject.devDependencies,
    standard: '^8.6.0',
    ghooks: '^1.3.2'
  },
  standard: {
    rules: {
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx'] }
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: true,
          peerDependencies: true
        }
      ],
      'react/forbid-prop-types': [0]
    },
    'no-plusplus': [
      1,
      { allowForLoopAfterthoughts: true }
    ]
  },
  config: {
    ghooks: {
      'pre-commit': `${packageObject.scripts.coverage} && standard --fix src`
    }
  },
  scripts: {
    ...packageObject.scripts,
    test: `standard --fix src && ${packageObject.scripts.test}`,
    fix: 'standard --fix package.js src/**/*'
  }
}
/* endstamp */

module.exports = packageObject
