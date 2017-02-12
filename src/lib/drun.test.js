import { beforeEach, describe, it } from 'mocha'
import expect, { createSpy } from 'expect'
import proxyquire from 'proxyquire'

describe('DRun', () => {
  beforeEach(function beforeEachBody () {})

  describe('default run', () => {
    beforeEach(function beforeEachBody () {
      this.spawnSpy = createSpy().andReturn(
        {
          on: (name, cb) => {
            if(name === 'close')
              cb()
          }
        }
      )
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        }
      }
      this.module = proxyquire('./drun', this.mocks).default

      return this.module('mycommand')
    })

    it('should run the specified command with a default image', function testBody () {
      const actual = this.spawnSpy.calls[0].arguments.slice(0,2)
      const expected = [
        'docker',
        [
          "run",
          "-it",
          "--rm",
          "--name",
          "drun-alpine",
          "-w",
          "/src",
          "-v",
          "/src:/src",
          "node:alpine",
          "/bin/sh",
          "-c",
          "mycommand"
        ]
      ]

      expect(actual)
        .toEqual(expected)
    })

    it.skip('should build use random port by default')
  })

  describe('custom image configuration', () => {
    it.skip('should build the right volumes parameters')
    it.skip('should build the right port parameters')
    it.skip('should build the image if its a local dockerfile')
    it.skip('should use a custom image if specified')
  })
})
