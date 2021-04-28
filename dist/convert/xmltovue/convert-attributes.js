'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryPath = require('../../util/query-path.js');

var _queryPath2 = _interopRequireDefault(_queryPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var staticObject = {
    /**
     * Attributes we'll convert
     *
     * @todo Why don't we convert all attributes that have tags?
     *  I'm guessing because it's easier to NOT do it with query path?
     *
     * @var array
     */
    $attributesHtml: ['class', 'href', 'id', 'style', 'title']

    /**
     * Converter
     *
     * This class attempts to fix attributes that have logic in them
     * such as:
     *
     *     <div class="{{ foo }}">
     *
     * Becomes:
     *
     *     <div :class="foo">
     */
};
var ConvertAttributes = function () {
    function ConvertAttributes() {
        _classCallCheck(this, ConvertAttributes);
    }

    _createClass(ConvertAttributes, null, [{
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
        value: function convert($queryPath) {
            var $attributes = void 0,
                $html = void 0;

            $html = $queryPath.html() || '';
            $html = encodeURIComponent($html);
            $attributes = ConvertAttributes.getAttributesFromHtml($html);

            // Parse attributes
            $attributes.forEach(function ($attribute) {
                var $elements = void 0;

                $elements = $queryPath.findAll('[' + $attribute + '*="{{"]');

                // Loop through presentation attributes with variables
                $elements.forEach(function ($element) {
                    var $attributeValue = void 0,
                        $newAttribute = void 0,
                        $newValue = void 0;

                    $attributeValue = $element.getAttribute($attribute);

                    // Set values
                    $newAttribute = ':' + $attribute;
                    $newValue = $attributeValue;
                    // $newValue = Util\StringUtility.removeTags($attributeValue);

                    // Convert brackets to quotes
                    $newValue = $newValue.replaceAll('{{', "' + ");
                    $newValue = $newValue.replaceAll('}}', " + '");
                    $newValue = "'" + $newValue + "'";

                    // Fix empty brackets
                    $newValue = $newValue.replaceAll("'' + ", '');
                    $newValue = $newValue.replaceAll("' ' + ", '');
                    $newValue = $newValue.replaceAll(" + ''", '');
                    $newValue = $newValue.replaceAll(" + ' '", '');

                    // Trim
                    $newValue = $newValue.trim();

                    // Set Vue style attribute
                    $element.setAttribute($newAttribute, $newValue);

                    // Remove old attribute
                    $element.removeAttribute($attribute);
                });
            });

            return $queryPath.html() || '';
        }

        /**
         * Extract attributes using variables from HTML
         */

    }, {
        key: 'getAttributesFromHtml',
        value: function getAttributesFromHtml($html) {
            var $matches = void 0,
                $pattern = void 0;

            // v2: Adding the brackets
            $pattern = new RegExp('\s([a-zA-Z\_\-]+)=["\'][^"\']+["\']', 'img');

            // v1: Why did we ignore the {{ brackets?
            // $regex = '#\s([a-zA-Z\_\-]+)=["\'](?={{)[^"\']+["\']#im';

            // $regex = '#\s([a-zA-Z\_]+)=["\'](?={{)["\']#im';
            // $html = '<a href="{{ header.href }}" title="{{ header.text">{{ header.title }}</a>';

            // Run matching
            $matches = [].concat(_toConsumableArray($html.matchAll($pattern)));

            // Return matches
            if ($matches.length > 1) {
                return $matches[1].filter(function (el, index, arr) {
                    return index == arr.indexOf(el);
                });
            } else {
                return staticObject.$attributesHtml;
            }
        }
    }]);

    return ConvertAttributes;
}();

exports.default = ConvertAttributes;