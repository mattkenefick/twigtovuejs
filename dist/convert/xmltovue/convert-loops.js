"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _queryPath = _interopRequireDefault(require("../../util/query-path.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Converter
 */
var ConvertLoops = /*#__PURE__*/function () {
  function ConvertLoops() {
    _classCallCheck(this, ConvertLoops);
  }

  _createClass(ConvertLoops, null, [{
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
      var $results = $queryPath.findAll('for'); // Apply for loops

      $results.forEach(function ($item) {
        var $attributeValue, $child, $collection, $iterator, $matches, $model, $original;
        $iterator = $item.getAttribute('iterator');
        $matches = /([^ ]+) (?:of|in) (.*)$/.exec($iterator); // Deconstruct matches

        var _$matches = $matches;

        var _$matches2 = _slicedToArray(_$matches, 3);

        $original = _$matches2[0];
        $model = _$matches2[1];
        $collection = _$matches2[2];
        // Get child
        $child = $item.children[0]; // Apply

        $attributeValue = '(' + $model + ', index) of ' + $collection;
        $child.setAttribute('v-for', $attributeValue);
        $child.setAttribute('v-bind:key', 'index'); // Remove the for loop

        $queryPath.unwrap($child.parentNode);
      });
      return $queryPath.html() || '';
    }
  }]);

  return ConvertLoops;
}();

exports["default"] = ConvertLoops;