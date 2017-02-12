import { beforeEach, describe, it } from 'mocha'
import expect, { createSpy } from 'expect'
import proxyquire from 'proxyquire'

describe('Drun CLI test', () => {
  describe('default', () => {
    beforeEach(function beforeEachBody () {
      this.drunSpy = createSpy().andReturn(Promise.resolve())
      this.mocks = {
        process: {
          exit: () => Promise.resolve()
        },
        '../lib/drun.js': {
          default: this.drunSpy
        },
        'yargs': {
          'argv': {
            _: ['param1', 'param2']
          }
        }
      }
      this.module = proxyquire('./drun.js', this.mocks).default

      return this.module
    })

    it('call drun with the right parameters', function testBody () {
      expect(this.drunSpy).toHaveBeenCalledWith('param1', 'param2')
    })
  })
})
