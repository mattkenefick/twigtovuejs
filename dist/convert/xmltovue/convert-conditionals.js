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
var ConvertConditionals = /*#__PURE__*/function () {
  function ConvertConditionals() {
    _classCallCheck(this, ConvertConditionals);
  }

  _createClass(ConvertConditionals, null, [{
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
      ConvertConditionals._convert($queryPath, 'if');

      ConvertConditionals._convert($queryPath, 'elseif', 'else-if');

      ConvertConditionals._convert($queryPath, 'else');

      return $queryPath.html() || '';
    }
    /**
     *
     */

  }, {
    key: "_convert",
    value: function _convert($queryPath, $searchType) {
      var $attributeType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      // Convert one type to another
      if ($attributeType === null) {
        $attributeType = $searchType;
      } // Check for conditionals


      var $results = $queryPath.findAll($searchType); // Iterate through results

      $results.forEach(function ($item, key) {
        var $attributeValue, $condition, $child; // Get condition type

        $condition = $item.getAttribute('condition'); // Get child

        $child = $item.querySelector('*'); // Apply

        $attributeValue = $condition;
        $attributeValue = $attributeValue.replaceAll(' and ', ' && ');
        $attributeValue = $attributeValue.replaceAll(' or ', ' || ');
        $attributeValue = $attributeValue.replaceAll('&gt;', '>');
        $attributeValue = $attributeValue.replaceAll('&lt;', '<');
        $child.setAttribute('v-' + $attributeType, $attributeValue); // Remove the for loop

        $queryPath.unwrap($child.parentNode);
      });
      return $queryPath;
    }
  }]);

  return ConvertConditionals;
}();

exports["default"] = ConvertConditionals;