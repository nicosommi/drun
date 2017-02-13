# DRun

Run your npm scripts within an specified environment. It requires docker ( [see how to install it here](https://docs.docker.com/engine/installation/)).

Easily define runtimes so your project run always in the environment you defined.
Useful for:
- running tests always within the same environment (the runtime environment, not the developer machine, deterministics tests)
- easily watch and restart server and long running processes with no extra effort/development (for example, a replace for nodemon)
- forget about being cross platform on your npm scripts! (you may stop using cross-env or shelljs everywhere)

Often you will run in similar environments. Cross-platform is not always a requirement, and even if it is, it will be better tested if it's controlled.
Why not just use docker directly? Because it can be cumbersome to remember runtimes for each one of your projects. With drun you can put that within your project.

## Features
* Configurable via package.json
* Default behavior right out of the box
* Define a default image
* Define N images
* NPM default support
* Piped colorful terminal

## Installation
```
npm install --save-dev drun
```

## Minimal configutation
This is just a local installation shortcut:
```javascript
{
  // ... the rest of the package json
  "scripts": {
    // your other scripts,
    "drun": "drun"
  }
  // ... the rest of the package json
}
```

And that's it, if you run `npm run drun` you'll get an alpine based node js running your tests!

## Example configuration
```javascript
/// ... package.json
{
  "drun": {
    "default": {
      "image": "node"
    }
  },
  "scripts": {
    "test": "mocha",
    "build": "babel src -d dist",
    "start": "node server.js",
    "drun": "drun",
    "drun:start:watch": "watch 'drun start' server.js"
  }
}
// ...
```
Then, if you run `npm run drun` it will execute `npm run test` within the latest node image on the docker hub.
Also, if you run `npm run drun build` it will execute `npm run build` instead (test is just the default).

In a more complex example, if you run `npm run drun:start:watch` it will execute `npm start` and, with the help of the watch package for example (you can use whatever you want), it will kill the container and lift a brand new `npm start`.

Note that you don't need to create dirty long complex commands within your actual scripts.

### Using different containers
The above example is using the default container with a custom image.
However `drun` supports using N containers within your package.json.
For example, you can have this:
```javascript
/// ... package.json
{
  "drun": {
    "default": {
      "image": "node"
    },
    "building": {
      "image": "node:alpine"
    }
  },
  "scripts": {
    "test": "mocha",
    "build": "babel src -d dist",
    "start": "node server.js",
    "drun": "drun",
    "drun:start:watch": "watch 'drun start' server.js"
  }
}
// ...
```
Note the new building object with a different image.
Now, if you run `npm run drun build building` it will execute `npm run build` with the node:alpine image.
The general command is `npm run drun <command> <container>`.

## Considerations
- You can use your own images, but the building process is on you, that's by design.

## Available options
Drun configuration may have 1..N containers defined within it.
The `default` configuration is
``` javascript
{
  "drun": {
    "default": {
      "image": "node:alpine",
      "ports": {}, // this means random, execute docker port drun-default
      "volumes": {
        "./:/src" // drun will convert this to an absolute path atuomatically to make docker happy
      },
      "workingDirectory": "/src",
      "commandType": "raw" // if raw is specified it does not prefix commands with `npm run`
      "interactive": true, // useful for some ci environments
      "tty": true // useful for some ci environments
    }
  }
}
```

A more complex command: `npm run drun "npm i" default`
This will execute the `npm i` command as a raw command in the default container

### Custom options
You may use more options:
```javascript
{
  "drun": {
    "custom": {
      "image": "node:alpine",
      "ports": {
        "8080": "8080"
      },
      "volumes": {
        "./": "/src",
        "/home": "/home"
      },
      "workingDirectory": "/src",
      "commandType": "raw"
    }
  }
}
```

MIT

nicosommi
