(function () {
  angular
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
        metadata[key] = parseInt(headers[PaginatorSettings.mapping[key]], 10)
      })

      return metadata
    }
  }
})();
