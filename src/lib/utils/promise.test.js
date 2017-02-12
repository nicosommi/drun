import Promise from './promise.js'
import expect from 'expect'

describe('Promise', () => {
  it('should have utility methods', () => {
    expect(Promise.map).toBeA('function')
  })
})
