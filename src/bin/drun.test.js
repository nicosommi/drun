import { beforeEach, describe, it } from 'mocha'
import expect, { createSpy } from 'expect'
import proxyquire from 'proxyquire'

describe('DRun', () => {
  beforeEach(function beforeEachBody () {
    // TODO: do something here
  })

  describe('Default', () => {
    beforeEach(function beforeEachBody () {
      this.mocks = {}
      // TODO: specifid mocks
      this.module = proxyquire('./drun', this.mocks).default
    })

    it('should be awesome', function testBody () {
      this.module()
    })
  })
})
