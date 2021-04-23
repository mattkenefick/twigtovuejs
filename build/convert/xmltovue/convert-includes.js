'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryPath = require('../../util/query-path.js');

var _queryPath2 = _interopRequireDefault(_queryPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Converter
 */
var ConvertIncludes = function () {
    function ConvertIncludes() {
        _classCallCheck(this, ConvertIncludes);
    }

    _createClass(ConvertIncludes, null, [{
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
            // Check for conditionals
            var $results = $queryPath.findAll('include');

            // Apply for includes
            $results.forEach(function ($item) {
                var $attributes = void 0,
                    $component = void 0;

                $component = $item.getAttribute('component');
                $attributes = $item.attributes;

                // Create element
                var element = $queryPath.createWith($component, $attributes);

                // Add to child
                $item.parentNode.insertBefore(element, $item);

                // Unwrap
                $queryPath.unwrap($item);
            });

            return $queryPath.html() || '';
        }
    }]);

    return ConvertIncludes;
}();

exports.default = ConvertIncludes;