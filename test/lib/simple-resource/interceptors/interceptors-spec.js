(function () {
  'use strict'

  describe('SimpleResource.SRInterceptor', function () {
    var SimplePaginator
    var SRInterceptor
    var SRParameters
    var SimpleResourceSettings
    var headers = function () {
      return {
        'X-Pagination-Limit': 25,
        'X-Pagination-Current-Page': 1
      }
    }

    beforeEach(module('SimpleResource'))
    beforeEach(inject(function ($injector) {
      SimplePaginator = $injector.get('SimplePaginator')
      SRInterceptor   = $injector.get('SRInterceptor')
      SRParameters    = $injector.get('SRParameters')
      SimpleResourceSettings      = $injector.get('SimpleResourceSettings')
    }))

    it('is defined', function () {
      expect(SRInterceptor).toBeDefined()
    })

    describe('#response', function () {
      it('returns a json response', function () {
        var response = SRInterceptor.response('{"name": "John Doe"}', headers)
        expect(response).toEqual({
          name: 'John Doe'
        })
      })

      describe('set pagination status', function () {
        beforeEach(function () {
          SimplePaginator.set = jasmine.createSpy('set')
        })

        it('calls the pagination service', function () {
          var response = SRInterceptor.response('{"name": "John Doe"}', headers)
          expect(SimplePaginator.set).toHaveBeenCalled()
        })
      })

      describe('SimpleResourceSettings.transformResponse is defined', function () {
        beforeEach(function () {
          SimpleResourceSettings.transformResponse = jasmine.createSpy('transformResponse').and.returnValue({
            post: {
              name: 'post name'
            }
          })
        })

        it('calls the method', function () {
          var response = SRInterceptor.response('{}', headers)
          expect(SimpleResourceSettings.transformResponse).toHaveBeenCalled()
        })

        it('returns a transformed response', function () {
          var response = SRInterceptor.response('{}', headers)

          expect(response).toEqual({
            post: {
              name: 'post name'
            }
          })
        })
      })
    })

    describe('#request', function () {
      describe('namespace is not defined', function () {
        it('returns data', function () {
          var request = SRInterceptor.request({ name: 'John Doe' })
          expect(request).toEqual('{"name":"John Doe"}')
        })
      })

      describe('namespace is defined', function () {
        beforeEach(function () {
          SRParameters.set({
            namespace: 'post'
          })
        })

        it('returns data wrap under `namespace` key', function () {
          var request = SRInterceptor.request({ name: 'John Doe' })
          expect(request).toEqual('{"post":{"name":"John Doe"}}')
        })
      })

      describe('SimpleResourceSettings.transformRequest is defined', function () {
        beforeEach(function () {
          SimpleResourceSettings.transformRequest = jasmine.createSpy('transformRequest').and.returnValue({
            name: 'post name',
            content: 'post content'
          })
        })

        it('calls the method', function () {
          var response = SRInterceptor.request({ name: 'John Doe' })
          expect(SimpleResourceSettings.transformRequest).toHaveBeenCalled()
        })

        it('returns a transformed request', function () {
          var request = SRInterceptor.request({ name: 'John Doe' })
          expect(request).toEqual('{"name":"post name","content":"post content"}')
        })
      })
    })
  })
})()
