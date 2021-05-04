"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _preg_match_all = _interopRequireDefault(require("./polyfill/preg_match_all.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Parser
 *
 * Attemps to extract all tags, variables, and comments from a Twig string
 * like:
 *     {var $comments, $methods, $tags, $template, $filename, $html, $pattern, $subject, $matches;# (.*) #}
 *     {{ xyz(...) }}
 *     {% (.*) %}
 *     {{ xyz }}
 */
var Parser = /*#__PURE__*/function () {
  /**
   * Constructor
   *
   * @param string $template
   */
  function Parser() {
    var $template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, Parser);

    // Force html
    // if ($template.match(/\.twig$/)) {
    //     this.import($template);
    // }
    // else {
    this.setHtml($template); // }
  } // /**
  //  * Get source file
  //  *
  //  * @param  string $filename
  //  *
  //  * @return string
  //  */
  // import($filename = '')
  // {
  //     return this.setHtml(require($filename));
  // }

  /**
   * Set markup
   *
   * @param  string $html
   *
   * @return string
   */


  _createClass(Parser, [{
    key: "setHtml",
    value: function setHtml($html) {
      return this.template = $html;
    }
    /**
     * Parse Twig Tags
     *
     * @param  string
     * @return void
     */

  }, {
    key: "parse",
    value: function parse() {
      this.parseComments();
      this.parseMethods();
      this.parseTags();
      this.parseVariables();
    }
    /**
     * [parseComments description]
     * @return [type]
     */

  }, {
    key: "parseComments",
    value: function parseComments() {
      var $pattern, $subject, $matches;
      $pattern = /{\# ([^#]+) ?\#}/gm;
      $subject = this.template;
      $matches; // Find all {# ... #} tags

      $matches = (0, _preg_match_all["default"])($pattern, $subject);
      this.comments = $matches;
    }
    /**
     * [parseMethods description]
     * @return [type]
     */

  }, {
    key: "parseMethods",
    value: function parseMethods() {
      var $pattern, $subject, $matches;
      $pattern = /{{ ([a-zA-Z0-9\_]+)\((.*)\) }}/gm;
      $subject = this.template;
      $matches; // Find all {{ xyz... }} tags

      $matches = (0, _preg_match_all["default"])($pattern, $subject);
      this.methods = $matches;
    }
    /**
     * [parseTags description]
     * @return [type]
     */

  }, {
    key: "parseTags",
    value: function parseTags() {
      var $pattern, $subject, $matches;
      $pattern = /{% ([^%]+) ?%}/gm;
      $subject = this.template;
      $matches; // Find all {% ... %} tags

      $matches = (0, _preg_match_all["default"])($pattern, $subject);
      this.tags = $matches;
    }
    /**
     * [parseVariables description]
     * @return [type]
     */

  }, {
    key: "parseVariables",
    value: function parseVariables() {
      var $pattern, $subject, $matches;
      $pattern = /{{ ([a-zA-Z0-9\_]+) }}/gm;
      $subject = this.template;
      $matches; // Find all {{ $... }} tags

      $matches = (0, _preg_match_all["default"])($pattern, $subject);
      this.variables = $matches;
    }
  }]);

  return Parser;
}();

exports["default"] = Parser;