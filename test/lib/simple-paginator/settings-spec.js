(function () {
  'use strict'

  describe('SimplePaginator.PaginatorSettings', function () {
    var settings

    beforeEach(module('SimplePaginator', function (PaginatorSettingsProvider) {
      settings = PaginatorSettingsProvider
    }))

    it('has a `configure` method', inject(function (PaginatorSettings) {
      expect(settings.configure).toBeDefined()
    }))

    it('has a default `mapping`', inject(function (PaginatorSettings) {
      expect(settings.mapping).toEqual({
        perPage:    'X-Pagination-Limit',
        current:    'X-Pagination-Current-Page',
        total:      'X-Pagination-Total-Count',
        totalPages: 'X-Pagination-Total-Pages'
      })
    }))

    describe('#configure', function () {
      beforeEach(module('SimplePaginator', function (PaginatorSettingsProvider) {
        PaginatorSettingsProvider.configure({
          mapping: {
            perPage: 'X-Limit',
            current: 'X-Page'
          }
        })
      }))

      it('overrides default `mapping`', inject(function (PaginatorSettings) {
        expect(settings.mapping).toEqual({
          perPage: 'X-Limit',
          current: 'X-Page'
        })
      }))
    })
  })
})();
