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
  .factory('SimpleResource', function ($resource, SRHelper, SRInterceptor, SRParameters) {
    var Resource = function (options) {
      SRParameters.set(options)

      var defaults = {
        query:   { method: 'GET', isArray: true, transformResponse: SRInterceptor.response },
        get:     { method: 'GET' },
        create:  { method: 'POST', transformRequest: SRInterceptor.request },
        update:  { method: 'PUT',  transformRequest: SRInterceptor.request },
        destroy: { method: 'DELETE' }
      }
      angular.extend(defaults, SRParameters.get('methods'))

      var endpoint = SRParameters.get('baseUrl') + SRParameters.get('url')
      var resource = $resource(endpoint, SRParameters.get('params'), defaults)

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
  })
