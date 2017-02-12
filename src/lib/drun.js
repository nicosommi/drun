import { spawn } from 'child_process'
import findUp from 'find-up'

export default function drun (command, container = 'alpine') {
  return new Promise(
    (resolve, reject) => {
      // filter by container if provided and found
      // find package.json configuration
      const currentDirectory = process.cwd();
      const packageJson = require(`${findUp.sync('package.json', {cwd: currentDirectory})}`)
      let containerConfiguration = {
        image: 'node:alpine',
        volumes: {},
        ports: 'random'
      }
      if(packageJson.drun && packageJson.drun[container]) {
        containerConfiguration = {
          ...containerConfiguration,
          ...packageJson.drun[container]
        }
      }

      const child = spawn('docker',
        [
          'run',
          '-it',
          '--rm',
          '--name', `drun-${container}`,
          '-w', '/src',
          '-v', `${currentDirectory}:/src`,
          `${containerConfiguration.image}`,
          '/bin/sh', '-c',
          `${command}`
        ],
        { stdio: 'inherit' }
      )
      child.on('error', (error) => {
        reject(error);
      });
      child.on('close', () => {
        resolve();
      });
    }
  )
}
