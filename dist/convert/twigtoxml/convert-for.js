"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Converter
 */
var ConvertFor = /*#__PURE__*/function () {
  function ConvertFor() {
    _classCallCheck(this, ConvertFor);
  }

  _createClass(ConvertFor, null, [{
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
    function convert($str, $tag, $outerValue, $attributeValue) {
      switch ($tag) {
        case 'for':
          return ConvertFor.convertFor($str, $outerValue, $attributeValue);

        case 'endfor':
          return ConvertFor.convertEndFor($str, $outerValue, $attributeValue);
      }
    }
    /**
     * Convert For
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */

  }, {
    key: "convertFor",
    value: function convertFor($str, $outerValue, $attributeValue) {
      var $value;
      $value = $str.replaceAll($outerValue, '<for iterator="' + $attributeValue + '">');
      return $value;
    }
    /**
     * Convert EndFor
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */

  }, {
    key: "convertEndFor",
    value: function convertEndFor($str, $outerValue, $attributeValue) {
      var $value;
      $value = $str.replaceAll($outerValue, '</for>');
      return $value;
    }
  }]);

  return ConvertFor;
}();

exports["default"] = ConvertFor;