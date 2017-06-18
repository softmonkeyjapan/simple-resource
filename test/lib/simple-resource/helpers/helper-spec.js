(function () {
  'use strict'

  describe('SimpleResource.SRHelper', function () {
    var SRHelper

    beforeEach(module('SimpleResource'))
    beforeEach(inject(function ($injector) {
      SRHelper = $injector.get('SRHelper')
    }))

    it('is defined', function () {
      expect(SRHelper).toBeDefined()
    })

    describe('#isNumeric', function () {
      describe('number is pass', function () {
        it('returns true', function () {
          expect(SRHelper.isNumeric(12)).toBeTruthy()
        })
      })

      describe('string as number is pass', function () {
        it('returns true', function () {
          expect(SRHelper.isNumeric('12')).toBeTruthy()
        })
      })

      describe('string is pass', function () {
        it('returns false', function () {
          expect(SRHelper.isNumeric('number')).toBeFalsy()
        })
      })

      describe('object is pass', function () {
        it('returns false', function () {
          expect(SRHelper.isNumeric({})).toBeFalsy()
        })
      })
    })
  })
})();
