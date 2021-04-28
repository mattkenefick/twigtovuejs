'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preg_replace = require('../polyfill/preg_replace.js');

var _preg_replace2 = _interopRequireDefault(_preg_replace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * String
 */
var StringUtility = function () {
    function StringUtility() {
        _classCallCheck(this, StringUtility);
    }

    _createClass(StringUtility, null, [{
        key: 'between',

        /**
         * Get between two integer points
         *
         * @param  $str
         * @param  $start Starting string
         * @param  $end   Ending string
         * @return string
         */
        value: function between($str, $start, $end) {
            var $fromEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var $length = void 0,
                $index = void 0;

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
        key: 'removeTags',
        value: function removeTags($str) {
            return (0, _preg_replace2.default)(/({{|}})/mg, '', $str).trim();
        }
    }]);

    return StringUtility;
}();

exports.default = StringUtility;