import { beforeEach, describe, it } from 'mocha'
import expect, { createSpy } from 'expect'
import proxyquire from 'proxyquire'

describe('dkill', () => {
  describe('default', () => {
    beforeEach(function beforeEachBody () {
      this.spawnSpy = createSpy().andReturn(
        {
          on: (name, cb) => {
            if (name === 'close') {
              cb()
            }
          }
        }
      )
      this.dkillSpy = createSpy().andReturn(Promise.resolve())
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        }
      }
      this.module = proxyquire('./dkill.js', this.mocks).default

      return this.module()
    })

    it('should call kill correctly', function testBody () {
      const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)
      const expected = ['docker', ['kill', 'drun-default']]
      expect(actual).toEqual(expected)
    })
  })

  describe('error on kill', () => {
    beforeEach(function beforeEachBody () {
      this.spawnSpy = createSpy().andReturn(
        {
          on: (name, cb) => {
            if (name === 'error') {
              cb(new Error('an error'))
            }
          }
        }
      )
      this.dkillSpy = createSpy().andReturn(Promise.resolve())
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        }
      }
      this.module = proxyquire('./dkill.js', this.mocks).default

      return this.module('containerName')
        .catch(() => Promise.resolve())
    })

    it('should call kill correctly', function testBody () {
      const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)
      const expected = ['docker', ['kill', 'containerName']]
      expect(actual).toEqual(expected)
    })
  })
})
