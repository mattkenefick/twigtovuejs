'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryPath = require('../../util/query-path.js');

var _queryPath2 = _interopRequireDefault(_queryPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Converter
 */
var ConvertLoops = function () {
    function ConvertLoops() {
        _classCallCheck(this, ConvertLoops);
    }

    _createClass(ConvertLoops, null, [{
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
            var $results = $queryPath.findAll('for');

            // Apply for loops
            $results.forEach(function ($item) {
                var $attributeValue = void 0,
                    $child = void 0,
                    $collection = void 0,
                    $iterator = void 0,
                    $matches = void 0,
                    $model = void 0,
                    $original = void 0;

                $iterator = $item.getAttribute('iterator');
                $matches = /([^ ]+) (?:of|in) (.*)$/.exec($iterator);

                // Deconstruct matches


                // Get child
                var _$matches = $matches;

                var _$matches2 = _slicedToArray(_$matches, 3);

                $original = _$matches2[0];
                $model = _$matches2[1];
                $collection = _$matches2[2];
                $child = $item.children[0];

                // Apply
                $attributeValue = '(' + $model + ', index) of ' + $collection;
                $child.setAttribute('v-for', $attributeValue);
                $child.setAttribute('v-bind:key', 'index');

                // Remove the for loop
                $queryPath.unwrap($child.parentNode);
            });

            return $queryPath.html() || '';
        }
    }]);

    return ConvertLoops;
}();

exports.default = ConvertLoops;