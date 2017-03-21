(function () {
  'use strict'

  describe('SimpleResource.SRParameters', function () {
    var SRParameters

    beforeEach(module('SimpleResource'))
    beforeEach(inject(function ($injector) {
      SRParameters = $injector.get('SRParameters')
    }))

    it('is defined', function () {
      expect(SRParameters).toBeDefined()
    })

    describe('.get', function () {
      beforeEach(function () {
        SRParameters.set({
          option1: 'option1',
          option2: 'option2'
        })
      })

      describe('with argument', function () {
        it('returns option value', function () {
          expect(SRParameters.get('option1')).toEqual('option1')
        })
      })

      describe('without argument', function () {
        it('returns all options', function () {
          expect(SRParameters.get()).toEqual({
            option1: 'option1',
            option2: 'option2',
            methods: {},
            params : {},
            baseUrl: undefined
          })
        })
      })
    })

    describe('.set', function () {
      describe('argument is a string', function () {
        it('returns default options from singular resource name', function () {
          SRParameters.set('post')
          expect(SRParameters.get()).toEqual({
            url: '/posts/:id/:action',
            params: { id: '@id', action: '@action' },
            namespace: 'post',
            methods: {},
            baseUrl: undefined
          })
        })
      })

      describe('argument is an object', function () {
        it('returns the object as is', function () {
          var options = {
            url: '/me',
            baseUrl: 'http://api.domain.com'
          }

          SRParameters.set(options)

          expect(SRParameters.get()).toEqual(
            angular.extend(options, { methods: {}, params: {} })
          )
        })
      })

      describe('argument is not supported', function () {
        it('throws an error', function () {
          expect(function () {
            SRParameters.set(null)
          }).toThrow()

          expect(function () {
            SRParameters.set(10)
          }).toThrow()
        })
      })
    })
  })
})()
