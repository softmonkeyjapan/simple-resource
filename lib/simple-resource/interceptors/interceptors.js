(function () {
  angular
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
})();
