'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Converter
 */
var ConvertFor = function () {
    function ConvertFor() {
        _classCallCheck(this, ConvertFor);
    }

    _createClass(ConvertFor, null, [{
        key: 'convert',

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
        value: function convert($str, $tag, $outerValue, $attributeValue) {
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
        key: 'convertFor',
        value: function convertFor($str, $outerValue, $attributeValue) {
            var $value = void 0;

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
        key: 'convertEndFor',
        value: function convertEndFor($str, $outerValue, $attributeValue) {
            var $value = void 0;

            $value = $str.replaceAll($outerValue, '</for>');
            return $value;
        }
    }]);

    return ConvertFor;
}();

exports.default = ConvertFor;