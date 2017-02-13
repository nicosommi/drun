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
          '/src',
          '-p', '9000:80',
          '-v', `${process.cwd()}:/src`,
          '-v', '/home:/home',
          'node',
          '/bin/sh',
          '-c',
          'mycommand'
        ]
      ]

      expect(actual)
        .toEqual(expected)
    })
  })

  describe('custom non interactive configuration', () => {
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
    })

    describe('no tty no interactive', () => {
      beforeEach(function beforeEachBody () {
        return this.module('mycommand', 'customnoitty')
      })

      it('should build the right volumes, port, etc parameters', function testBody () {
        const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1]
        const expected = [
          'run',
          '--rm',
          '--name',
          'drun-customnoitty',
          '-w',
          '/src',
          '-P',
          '-v', `${process.cwd()}:/src`,
          'node:alpine',
          '/bin/sh',
          '-c',
          'npm run mycommand'
        ]

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('no interactive', () => {
      beforeEach(function beforeEachBody () {
        return this.module('mycommand', 'customnoi')
      })

      it('should build the right volumes, port, etc parameters', function testBody () {
        const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1]
        const expected = [
          'run',
          '-t',
          '--rm',
          '--name',
          'drun-customnoi',
          '-w',
          '/src',
          '-P',
          '-v', `${process.cwd()}:/src`,
          'node:alpine',
          '/bin/sh',
          '-c',
          'npm run mycommand'
        ]

        expect(actual)
          .toEqual(expected)
      })
    })

    describe('no tty', () => {
      beforeEach(function beforeEachBody () {
        return this.module('mycommand', 'customnotty')
      })

      it('should build the right volumes, port, etc parameters', function testBody () {
        const actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1]
        const expected = [
          'run',
          '-i',
          '--rm',
          '--name',
          'drun-customnotty',
          '-w',
          '/src',
          '-P',
          '-v', `${process.cwd()}:/src`,
          'node:alpine',
          '/bin/sh',
          '-c',
          'npm run mycommand'
        ]

        expect(actual)
          .toEqual(expected)
      })
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
