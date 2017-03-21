angular
  .module('SimpleResource')
  .service('SRParameters', SRParameters)

function SRParameters (inflector, SimpleResourceSettings) {
  var service = {
    get: get,
    set: set
  }

  return service

  /**
   * Get a given option.
   *
   * @param  {String} key option name.
   * @return {Mix} Option's value.
   */
  function get (key) {
    this.options = this.options || {}
    if (key) return this.options[key]
    return this.options
  }

  /**
   * Transform and set options.
   *
   * @param  {Mix} Javascript object or string (singular resource name).
   * @return {void}
   */
  function set (options) {
    this.options = transform(options)
    this.options.params  = this.options.params  || {}
    this.options.methods = this.options.methods || {}
    this.options.baseUrl = this.options.baseUrl || SimpleResourceSettings.apiUrl
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
