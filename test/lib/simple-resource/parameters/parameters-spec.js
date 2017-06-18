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

    describe('.format', function () {
      describe('argument is a string', function () {
        it('returns default options from singular resource name', function () {
          var result = SRParameters.format('post')

          expect(result).toEqual({
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

          var result = SRParameters.format(options)

          expect(result).toEqual(
            angular.extend(options, { methods: {}, params: {} })
          )
        })
      })

      describe('argument is not supported', function () {
        it('throws an error', function () {
          expect(function () {
            SRParameters.format(null)
          }).toThrow()

          expect(function () {
            SRParameters.format(10)
          }).toThrow()
        })
      })
    })
  })
})();
