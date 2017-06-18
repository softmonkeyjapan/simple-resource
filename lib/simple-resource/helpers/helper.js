(function () {
  angular
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
})();
