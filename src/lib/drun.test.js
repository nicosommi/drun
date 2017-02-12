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
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      }
      this.module = proxyquire('./drun', this.mocks).default

      return this.module()
    })

    it('should run the specified command with a default image', function testBody () {
      const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)
      const expected = [
        'docker',
        [
          'run',
          '-it',
          '--rm',
          '--name',
          'drun-default',
          '-w',
          '/src',
          '-P',
          '-v', `${process.cwd()}:/src`,
          'node:alpine',
          '/bin/sh',
          '-c',
          'npm run test'
        ]
      ]

      expect(actual)
        .toEqual(expected)
    })
  })

  describe('custom image configuration', () => {
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
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      }
      this.module = proxyquire('./drun', this.mocks).default

      return this.module('mycommand', 'custom')
    })

    it('should build the right volumes, port, etc parameters', function testBody () {
      const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)
      const expected = [
        'docker',
        [
          'run',
          '-it',
          '--rm',
          '--name',
          'drun-custom',
          '-w',
          '/home/myself',
          '-p', '9000:80',
          '-v', './:/src',
          '-v', '/home:/home',
          'node:custom',
          '/bin/sh',
          '-c',
          'mycommand'
        ]
      ]

      expect(actual)
        .toEqual(expected)
    })
  })

  describe('on dkill error', () => {
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
      this.dkillSpy = createSpy().andReturn(Promise.reject())
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      }
      this.module = proxyquire('./drun', this.mocks).default

      return this.module('mycommand')
    })

    it('should run the specified command anyway', function testBody () {
      const actual = this.spawnSpy.calls.length
      const expected = 1

      expect(actual)
        .toEqual(expected)
    })
  })
})
