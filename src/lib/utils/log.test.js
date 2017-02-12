import getLogger from './log.js'

const logger = getLogger('test')

describe('log', () => {
  it('should log', () => {
    return logger.log({}, 'to.my.value')
  })
})
