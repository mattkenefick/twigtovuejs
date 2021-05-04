"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _array_slice = _interopRequireDefault(require("../../polyfill/array_slice.js"));

var _preg_match = _interopRequireDefault(require("../../polyfill/preg_match.js"));

var _preg_replace = _interopRequireDefault(require("../../polyfill/preg_replace.js"));

var _preg_replace_callback = _interopRequireDefault(require("../../polyfill/preg_replace_callback.js"));

var _dirtyJson = _interopRequireDefault(require("dirty-json"));

var _string = _interopRequireDefault(require("../../util/string.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var staticObject = {
  /**
   * Prevents us from creating attributes for object references
   * and only allows literal values, like :property="'String'"
   * as opposed to :foo="bar"
   *
   * @todo  Why did we want this?
   * @todo  How can we toggle this from an app?
   *
   * @var boolean
   */
  $onlyLiteralAttributes: false
};
/**
 * Converter
 */

var ConvertInclude = /*#__PURE__*/function () {
  function ConvertInclude() {
    _classCallCheck(this, ConvertInclude);
  }

  _createClass(ConvertInclude, null, [{
    key: "convert",
    value:
    /**
     * Convert
     *
     * @param  $str
     * @param  $tag
     * @param  $outerValue
     * @param  $attributeValue
     *
     * @return string
     */
    function convert($str, $tag, $outerValue, $attributeValue) {
      switch ($tag) {
        case 'include':
          return ConvertInclude.convertInclude($str, $outerValue, $attributeValue);
      }
    }
    /**
     * Convert Include
     *
     * @param  $str
     * @param  $tag
     * @param  $outerValue
     * @param  $attributeValue
     *
     * @return string
     */

  }, {
    key: "convertInclude",
    value: function convertInclude($str, $outerValue, $attributeValue) {
      var $a, $attributes, $b, $bob, $component, $filepath, $jsonStr, $matches, $parts, $with, $value; // Take the latter half of the concatenation to simplify the regex

      $a = $attributeValue.indexOf(' ~ ') > 1 ? $attributeValue.substr($attributeValue.indexOf(' ~ ') + 3) : $attributeValue; // Convert outerValue to use new attributeValue

      $b = $outerValue.replaceAll($attributeValue, $a); // Parse out the filename
      // This new regex asks for the last version

      $matches = (0, _preg_match["default"])(/(\'|\")((.*)\/?)(\.twig)?(\'|\")\s+?(?:%}|with)/gm, $b); // Get items within the quotes, "view/inner/foo/bar.twig"

      $matches = (0, _array_slice["default"])($matches, 2, -2);
      $filepath = $matches[0].replaceAll('.twig', '');
      $filepath = (0, _preg_replace["default"])(/[^a-zA-Z0-9\/]/gm, '', $filepath); // Break up path into words

      $parts = $filepath.split('/'); // Check if last two items the same

      if ($parts.length >= 2 && $parts[$parts.length - 1] === $parts[$parts.length - 2]) {
        $parts.pop();
      } // Combine into things like ViewInnerFooBar


      $component = $parts.map(function (x) {
        return x[0].toUpperCase() + x.substr(1);
      }).join(''); // Attributes between with { } brackets

      $attributes = ''; // @todo implement me

      $with = _string["default"].between($attributeValue, '{', '}', true);
      $jsonStr = '{ ' + $with + ' }'; // Convert inner commas otherwise we'd have to do some sort of lookahead
      // expression that I'm unsure how to do

      $jsonStr = (0, _preg_replace_callback["default"])(/\(([^)]+)\)/g, function ($matches) {
        return $matches[0].replaceAll(',', '^^^');
      }, $jsonStr); // Convert functions and variables to literals for JSON conversion
      // $jsonStr = preg_replace_callback('#:\s?([a-zA-Z][^,]+),#im', function($matches) {
      // $jsonStr = preg_replace_callback('#:\s?([a-zA-Z0-9\_]+),?$#im', function($matches) {

      $jsonStr = (0, _preg_replace_callback["default"])(/:\s?([a-zA-Z][^,]+),?$/gm, function ($matches) {
        $value = $matches[1];
        $value = $value.replaceAll('"', '\'');
        $value = $value.replaceAll(',', '^^^');
        return ': "@@' + $value + '",';
      }, $jsonStr); // Convert to JSON

      $bob = _dirtyJson["default"].parse($jsonStr); // Iterate through

      for (var $key in $bob) {
        var $x = void 0,
            _$value = void 0;

        _$value = $bob[$key]; // Remove null array data

        if (typeof _$value == 'array') {
          _$value = _$value.filter(function (x) {
            return x != '';
          }); // $value = array_filter($value);
        } // Encode


        $x = JSON.stringify(_$value); // Revert functions, variables, and commas

        $x = (0, _preg_replace["default"])(/["]?@@([^"]+)"?/gm, '$1', $x);
        $x = $x.replaceAll('\/', '/');
        $x = $x.replaceAll('^^^', ','); // Escape existing singles

        $x = $x.replaceAll('\'', '\\\''); // Convert doubles to singles

        $x = $x.replaceAll('"', '\''); // Wrap in quotes

        $x = "\"" + $x + "\""; // Fix literal strings

        $x = (0, _preg_replace["default"])(/""(.*)""/gm, "\"'$1'\"", $x);
        $attributes += ":" + $key + "=" + $x + "\n\n\n";
      }

      ; // Convert concatenated variables

      $attributes = $attributes.replaceAll("\' ~", "' ~");
      $attributes = $attributes.replaceAll("~ \'", "~ '");
      $value = $str.replace($outerValue, '<include component="' + $component + '" ' + $attributes + ' />');
      return $value;
    }
  }]);

  return ConvertInclude;
}();

exports["default"] = ConvertInclude;