import { spawn } from 'child_process'
import getLogger from './utils/log'

const logger = getLogger('nicosommi.drun.dkill')

export default function dkill (containerName = 'drun-default') {
  logger.log('Ensuring no conflict with another running container...')
  return new Promise(
    (resolve, reject) => {
      const child = spawn('docker',
        [
          'kill',
          `${containerName}`
        ],
        { stdio: 'inherit' }
      )
      child.on('error', (error) => {
        reject(error)
      })
      child.on('close', () => {
        resolve()
      })
    }
  )
}
