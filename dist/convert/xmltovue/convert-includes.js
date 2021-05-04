"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _queryPath = _interopRequireDefault(require("../../util/query-path.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Converter
 */
var ConvertIncludes = /*#__PURE__*/function () {
  function ConvertIncludes() {
    _classCallCheck(this, ConvertIncludes);
  }

  _createClass(ConvertIncludes, null, [{
    key: "convert",
    value:
    /**
     * Convert
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    function convert($queryPath) {
      // Check for conditionals
      var $results = $queryPath.findAll('include'); // Apply for includes

      $results.forEach(function ($item) {
        var $attributes, $component;
        $component = $item.getAttribute('component');
        $attributes = $item.attributes;
        $attributes.removeNamedItem('component'); // Create element

        var element = $queryPath.createWith($component, $attributes); // Add to child

        $item.parentNode.insertBefore(element, $item); // Unwrap

        $queryPath.unwrap($item);
      });
      return $queryPath.html() || '';
    }
  }]);

  return ConvertIncludes;
}();

exports["default"] = ConvertIncludes;