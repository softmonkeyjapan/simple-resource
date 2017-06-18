(function () {
  'use strict'

  describe('SimpleResource.SimpleResourceSettings', function () {
    var settings

    beforeEach(module('SimpleResource', function (SimpleResourceSettingsProvider) {
      settings = SimpleResourceSettingsProvider
    }))

    it('has a `configure` method', inject(function (SimpleResourceSettings) {
      expect(settings.configure).toBeDefined()
    }))

    it('has a default undefined `apiUrl`', inject(function (SimpleResourceSettings) {
      expect(settings.apiUrl).toBeUndefined()
    }))

    describe('#configure', function () {
      beforeEach(module('SimpleResource', function (SimpleResourceSettingsProvider) {
        SimpleResourceSettingsProvider.configure({
          apiUrl: 'http://api.domain.com'
        })
      }))

      it('has a defined `apiUrl`', inject(function (SimpleResourceSettings) {
        expect(settings.apiUrl).toEqual('http://api.domain.com')
      }))
    })
  })
})();
