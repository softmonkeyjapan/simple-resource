(function(){
'use strict';

SimplePaginator.$inject = ["PaginatorSettings"];angular
  .module('SimplePaginator', [])
  .provider('PaginatorSettings', function () {
    this.mapping = {
      perPage:    'X-Pagination-Limit',
      current:    'X-Pagination-Current-Page',
      total:      'X-Pagination-Total-Count',
      totalPages: 'X-Pagination-Total-Pages'
    }

    this.$get = function () {
      return {
        mapping: this.mapping
      }
    }

    this.configure = function (config) {
      for (var key in config) {
        this[key] = config[key]
      }
    }
  })
  .service('SimplePaginator', SimplePaginator)

function SimplePaginator (PaginatorSettings) {
  var service = {
    cache: {},
    set: set,
    get: get
  }

  return service

  /**
   * Retrieve pagination from response headers.
   *
   * @param  {Object} headers. Response headers.
   * @return {void} Store pagination headers in-memory.
   */
  function set (headers, namespace) {
    var firstKey = Object.keys(PaginatorSettings.mapping)[0]
    var property = PaginatorSettings.mapping[firstKey]

    if (headers[property])  {
      this.cache[namespace] = dataMapping(headers)
    } else {
      this.cache[namespace] = {}
    }
  }

  /**
   * Get pagination for a namespace.
   *
   * @param  {String} namespace. Cache key.
   * @return {Object} Pagination information.
   */
  function get (namespace) {
    var pagination = this.cache[namespace]

    if (!pagination) return

    return pagination
  }

  /**
   * Match PaginatorSettings.mapping and data
   * pagination headers and associate them.
   *
   * @param  {Object} headers. Response headers.
   * @return {Object}. Formated Object.
   */
  function dataMapping(headers) {
    var metadata = {}

    Object.keys(PaginatorSettings.mapping).forEach(function (key) {
      metadata[key] = headers[PaginatorSettings.mapping[key]]
    })

    return metadata
  }
}

angular
  .module('SimpleResource', [
    'ngResource',
    'platanus.inflector',
    'SimplePaginator'
  ])
  .provider('SimpleResourceSettings', function () {
    this.apiUrl = undefined

    this.$get = function () {
      return {
        apiUrl: this.apiUrl,
      }
    }

    this.configure = function (config) {
      for (var key in config) {
        this[key] = config[key];
      }
    }
  })
  .factory('SimpleResource', ["$resource", "SRHelper", "SRInterceptor", "SRParameters", function ($resource, SRHelper, SRInterceptor, SRParameters) {
    var Resource = function (options) {
      var options = SRParameters.format(options)

      /**
       * Transform response method.
       *
       * @param  {Mix} data Response data.
       * @param  {Function} headers Response headers.
       * @return {Mix}
       */
      var transformResponse = function (data, headers) {
        return SRInterceptor.response(options.namespace, data, headers);
      }

      /**
       * Transform request method.
       *
       * @param  {Object} data - Data to send.
       * @return {String} Stringify data.
       */
      var transformRequest = function (data) {
        return SRInterceptor.request(options.namespace, data)
      }

      var defaults = {
        query:   { method: 'GET', isArray: true, transformResponse: transformResponse },
        get:     { method: 'GET' },
        create:  { method: 'POST',  transformRequest: transformRequest },
        update:  { method: 'PATCH', transformRequest: transformRequest },
        destroy: { method: 'DELETE' }
      }
      angular.extend(defaults, options.methods)

      var endpoint = options.baseUrl + options.url
      var resource = $resource(endpoint, options.params, defaults)

      /**
       * Get an entire collection of objects.
       *
       * @param  {Object} args - $resource.query arguments.
       * @return {Promise} Promise
       */
      resource.all = function (args) {
        var options = args || {}
        return this.query(options)
      }

      /**
       * Find a specific object.
       *
       * @param  {Object|Integer} args - $resource.get arguments, or { id: args } if numeric.
       * @param  {Function} callback - $resource.get callback function if any.
       * @return {Promise} Promise
       */
      resource.find = function (args, callback) {
        var options = SRHelper.isNumeric(args) ? { id: args } : args
        return this.get(options, callback)
      }

      /**
       * Mixin custom methods to instance.
       *
       * @param  {Object} args - Set of properties to mixin the $resource object.
       * @return {this} this. Chainable.
       */
      resource.instanceMethods = function (args) {
        angular.extend(this.prototype, args)
        return this
      }

      /**
       * $resource's $save method override.
       * Allow to use $save in order to create or update a resource based on it's id.
       *
       * @return {Promise} Promise
       */
      resource.prototype.save = function () {
        var action = this.id ? '$update' : '$create'
        return this[action]()
      }

      /**
       * Delete instance object.
       *
       * @return {Promise} Promise
       */
      resource.prototype.delete = function () {
        if (!this.id) {
          throw new Error('Object must have an id to be deleted.')
        }

        return this.$destroy({ id: this.id })
      }

      return resource
    }

    return Resource
  }])


SRHelper.$inject = ["inflector"];angular
  .module('SimpleResource')
  .service('SRHelper', SRHelper)

function SRHelper (inflector) {
  var service = {
    isNumeric: isNumeric
  }

  return service

  /**
   * Check whether an object is a number.
   *
   * @param  {Object} object - Object to check numericallity on.
   * @return {Boolean} True if number, false otherwise.
   */
  function isNumeric (object) {
    return !isNaN(parseFloat(object)) && isFinite(object);
  }
}


SRInterceptor.$inject = ["SimpleResourceSettings", "SimplePaginator"];angular
  .module('SimpleResource')
  .service('SRInterceptor', SRInterceptor)

function SRInterceptor (SimpleResourceSettings, SimplePaginator) {
  var service = {
    response: response,
    request : request
  }

  return service

  /**
   * Transform response method.
   * Will be use as $resource's transformResponse.
   *
   * Allows us to detect any pagination metadata
   * present within headers.
   *
   * Allows end user to change the response using a
   * custom method through SimpleResourceSettings.transformResponse.
   *
   * @param  {String} namespace Resource namespace.
   * @param  {Mix} data Response data.
   * @param  {Function} headers Response headers.
   * @return {Mix}
   */
  function response (namespace, data, headers) {
    SimplePaginator.set(headers(), namespace)

    /* istanbul ignore else */
    if (SimpleResourceSettings.transformResponse) {
      data = SimpleResourceSettings.transformResponse(data, headers)
    }

    return angular.fromJson(data);
  }

  /**
   * Transform request method.
   * Will be use as $resource's transformRequest.
   *
   * If a namespace exists and is defined, then
   * wrap request data within it.
   *
   * Allows end user to change the request using a
   * custom method through SimpleResourceSettings.transformRequest.
   *
   * @param  {String} namespace Resource namespace.
   * @param  {Object} data - Data to send.
   * @return {String} Stringify data.
   */
  function request (namespace, data) {
    var namespace = namespace
    var requested = data

    /* istanbul ignore else */
    if (namespace) {
      var transform = {}
      transform[namespace] = data
      requested = transform
    }

    /* istanbul ignore else */
    if (SimpleResourceSettings.transformRequest) {
      requested = SimpleResourceSettings.transformRequest(requested)
    }

    return JSON.stringify(requested)
  }
}


SRParameters.$inject = ["inflector", "SimpleResourceSettings"];angular
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