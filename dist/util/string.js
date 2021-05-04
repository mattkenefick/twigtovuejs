"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _preg_replace = _interopRequireDefault(require("../polyfill/preg_replace.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * String
 */
var StringUtility = /*#__PURE__*/function () {
  function StringUtility() {
    _classCallCheck(this, StringUtility);
  }

  _createClass(StringUtility, null, [{
    key: "between",
    value:
    /**
     * Get between two integer points
     *
     * @param  $str
     * @param  $start Starting string
     * @param  $end   Ending string
     * @return string
     */
    function between($str, $start, $end) {
      var $fromEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var $length, $index;
      $str = ' ' + $str;
      $index = $str.indexOf($start);

      if ($index == 0) {
        return '';
      }

      $index += $start.length;
      $length = $fromEnd ? $str.substr($index).lastIndexOf($end) : $str.indexOf($end, $index) - $index;
      return $str.substr($index, $length);
    }
    /**
     * Remove tags
     *
     * @param  $str
     * @return string
     */

  }, {
    key: "removeTags",
    value: function removeTags($str) {
      return (0, _preg_replace["default"])(/({{|}})/mg, '', $str).trim();
    }
  }]);

  return StringUtility;
}();

exports["default"] = StringUtility;