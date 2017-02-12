import { spawn } from 'child_process'
import findUp from 'find-up'
import getLogger from './utils/log'

import dkill from './dkill.js'

const logger = getLogger('nicosommi.drun.core')

function massageParameter (prefix, object) {
  // console.log('massageParameter', { prefix, object })
  if (object && object !== undefined && typeof object === 'object') {
    const keys = Object.keys(object)
    if (keys.length > 0) {
      let result = []
      keys.forEach(
        propertyName => {
          result.push(`${prefix}`)
          result.push(`${propertyName}:${object[propertyName]}`)
        }
      )
      return result
    }
    return null
  }
  return null
}

export default function drun (script = 'test', container = 'default') {
  logger.log('DRun is taking place...')
  return new Promise(
    (resolve, reject) => {
      const containerName = `drun-${container}`
      dkill(containerName)
      .catch(() => Promise.resolve())
      .then(() => {
        logger.log('Now running container...', {containerName})
        // filter by container if provided and found
        // find package.json configuration
        let command = `npm run ${script}`
        const currentDirectory = process.cwd()
        const packageJson = require(`${findUp.sync('package.json', {cwd: currentDirectory})}`)
        let containerConfiguration = {
          image: 'node:alpine',
          volumes: {},
          ports: 'random'
        }
        if (packageJson.drun && packageJson.drun[container]) {
          containerConfiguration = {
            ...containerConfiguration,
            ...packageJson.drun[container]
          }
        }

        if (containerConfiguration.commandType === 'raw') {
          command = script
        }

        // console.log('process.env.npm_config_argv', {npmconfigargv: process.env.npm_lifecycle_event, container, containerConfiguration})

        let volumesParameters = massageParameter('-v', containerConfiguration.volumes)
        if (!volumesParameters) volumesParameters = ['-v', `${currentDirectory}:/src`]

        let portParameters = massageParameter('-p', containerConfiguration.ports)
        if (!portParameters) portParameters = ['-P']

        let workingDirectory = '/src'
        if (containerConfiguration.workingDirectory) workingDirectory = containerConfiguration.workingDirectory

        const child = spawn('docker',
          [
            'run',
            '-it',
            '--rm',
            '--name', containerName,
            '-w', workingDirectory,
            ...portParameters,
            ...volumesParameters,
            `${containerConfiguration.image}`,
            '/bin/sh', '-c',
            `${command}`
          ],
          { stdio: 'inherit' }
        )
        child.on('error', (error) => {
          reject(error)
        })
        child.on('close', () => {
          resolve()
        })
      })
    }
  )
}
