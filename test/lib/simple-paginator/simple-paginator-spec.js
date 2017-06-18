(function () {
  'use strict'

  describe('SimplePaginator.SimplePaginator', function () {
    var SimplePaginator
    var PaginatorSettings
    var headers = function () {
      return {
        'X-Limit': 25,
        'X-Page': 1
      }
    }

    beforeEach(module('SimplePaginator'))
    beforeEach(inject(function ($injector) {
      SimplePaginator = $injector.get('SimplePaginator')
      PaginatorSettings = $injector.get('PaginatorSettings')
    }))

    it('is defined', function () {
      expect(SimplePaginator).toBeDefined()
    })

    describe('#set', function () {
      beforeEach(function () {
        PaginatorSettings.mapping = {
          perPage: 'X-Limit',
          current: 'X-Page'
        }
      })

      describe('`mapping` rules found in headers', function () {
        it('caches headers', function () {
          SimplePaginator.set(headers(), 'post')
          expect(SimplePaginator.cache['post']).toEqual({
            perPage: 25,
            current: 1
          })
        })
      })

      describe('`mapping` rules not found in headers', function () {
        beforeEach(function () {
          headers = function () {
            return {
              'origin': 'https://www.domain.com',
              'status': 200
            }
          }
        })

        it('caches an empty object', function () {
          SimplePaginator.set(headers(), 'post')
          expect(SimplePaginator.cache['post']).toEqual({})
        })
      })
    })

    describe('#get', function () {
      beforeEach(function () {
        headers = function () {
          return {
            'X-Limit': 25,
            'X-Page': 1
          }
        }

        PaginatorSettings.mapping = {
          perPage: 'X-Limit',
          current: 'X-Page'
        }
      })

      describe('namespace defined', function () {
        beforeEach(function () {
          SimplePaginator.set(headers(), 'post')
        })

        it('returns pagination mapped after `mapping` configuration', function () {
          var cache = SimplePaginator.get('post')
          expect(cache).toEqual({
            perPage: 25,
            current: 1
          })
        })
      })

      describe('namespace undefined', function () {
        it('returns nothing', function () {
          var cache = SimplePaginator.get('post')
          expect(cache).toBeUndefined()
        })
      })
    })
  })
})();
