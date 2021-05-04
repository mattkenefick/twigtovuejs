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
};
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

var ConvertAttributes = /*#__PURE__*/function () {
  function ConvertAttributes() {
    _classCallCheck(this, ConvertAttributes);
  }

  _createClass(ConvertAttributes, null, [{
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
      var $attributes, $html;
      $html = $queryPath.html() || ''; // $html = encodeURIComponent($html);

      $attributes = ConvertAttributes.getAttributesFromHtml($html); // Parse attributes

      $attributes.forEach(function ($attribute) {
        var $elements;
        $elements = $queryPath.findAll('[' + $attribute + '*="{{"]'); // Loop through presentation attributes with variables

        $elements.forEach(function ($element) {
          var $attributeValue, $newAttribute, $newValue;
          $attributeValue = $element.getAttribute($attribute); // Set values

          $newAttribute = ':' + $attribute;
          $newValue = $attributeValue; // $newValue = Util\StringUtility.removeTags($attributeValue);
          // Convert brackets to quotes

          $newValue = $newValue.replaceAll('{{', "' + ");
          $newValue = $newValue.replaceAll('}}', " + '");
          $newValue = "'" + $newValue + "'"; // Fix empty brackets

          $newValue = $newValue.replaceAll("'' + ", '');
          $newValue = $newValue.replaceAll("' ' + ", '');
          $newValue = $newValue.replaceAll(" + ''", '');
          $newValue = $newValue.replaceAll(" + ' '", ''); // Kill new lines

          $newValue = $newValue.replaceAll('\n', '');
          $newValue = $newValue.replaceAll(/\s+/img, ' '); // Kill trailing empty strings + opening strings

          $newValue = $newValue.replaceAll(/^'\s/img, '\'');
          $newValue = $newValue.replaceAll(/\+\s''$/img, ''); // Trim

          $newValue = $newValue.trim(); // Set Vue style attribute

          $element.setAttribute($newAttribute, $newValue); // Remove old attribute

          $element.removeAttribute($attribute);
        });
      });
      return $queryPath.html() || '';
    }
    /**
     * Extract attributes using variables from HTML
     */

  }, {
    key: "getAttributesFromHtml",
    value: function getAttributesFromHtml($html) {
      var m,
          matches = [],
          regex,
          str; // v2: Adding the brackets

      regex = /\s([a-zA-Z\_\-]+)=["\'][^"\']+["\']/gmi; // v1: Why did we ignore the {{ brackets?
      // $regex = '#\s([a-zA-Z\_\-]+)=["\'](?={{)[^"\']+["\']#im';
      // $regex = '#\s([a-zA-Z\_]+)=["\'](?={{)["\']#im';
      // $html = '<a href="{{ header.href }}" title="{{ header.text">{{ header.title }}</a>';

      while ((m = regex.exec($html)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        } // The result can be accessed through the `m`-variable.


        m.forEach(function (match, groupIndex) {
          if (groupIndex == 1) {
            matches.push(match);
          } // console.log(`Found match, group ${groupIndex}: ${match}`);

        });
      } // Return matches


      if (matches.length > 1) {
        return matches.filter(function (el, index, arr) {
          return index == arr.indexOf(el);
        });
      } else {
        return staticObject.$attributesHtml;
      }
    }
  }]);

  return ConvertAttributes;
}();

exports["default"] = ConvertAttributes;