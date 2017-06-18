(function () {
  angular
    .module('SimpleResource')
    .service('SRParameters', SRParameters)

  function SRParameters (inflector, SimpleResourceSettings) {
    var service = {
      format: format
    }

    return service

    /**
     * Transform and format options.
     *
     * @param  {Mix} Javascript object or string (singular resource name).
     * @return {void}
     */
    function format (options) {
      var options = transform(options)
      options.params  = options.params  || {}
      options.methods = options.methods || {}
      options.baseUrl = options.baseUrl || SimpleResourceSettings.apiUrl
      return options
    }

    /**
     * SimpleResource instance parameters.
     * Allows to simplify call on api when using defaults.
     *
     * If the object passed is :
     *    - An object : Use it directly.
     *    - A string : Inflect it and use the default config.
     *    - Something else : Throw an error.
     *
     * @param  {Mix} args - Javascript object or string (singular resource name).
     * @return {Object} - Options to pass to $resource.
     */
    function transform (args) {
      if (args !== null && typeof args === 'string') {
        var resource = inflector.pluralize(args)

        return {
          url: '/' + resource + '/:id/:action',
          params: { id: '@id', action: '@action' },
          namespace: args
        }
      } else if (args !== null && typeof args === 'object') {
        return args
      } else {
        throw new Error('Argument must be a string or a valid Javascript object.')
      }
    }
  }
})();
