'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

var _preg_match_all = require('./polyfill/preg_match_all.js');

var _preg_match_all2 = _interopRequireDefault(_preg_match_all);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Parser = function () {
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
    this.setHtml($template);
    // }
  }

  // /**
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
    key: 'setHtml',
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
    key: 'parse',
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
    key: 'parseComments',
    value: function parseComments() {
      var $pattern = void 0,
          $subject = void 0,
          $matches = void 0;

      $pattern = /{\# ([^#]+) ?\#}/gm;
      $subject = this.template;
      $matches;

      // Find all {# ... #} tags
      $matches = (0, _preg_match_all2.default)($pattern, $subject);

      this.comments = $matches;
    }

    /**
     * [parseMethods description]
     * @return [type]
     */

  }, {
    key: 'parseMethods',
    value: function parseMethods() {
      var $pattern = void 0,
          $subject = void 0,
          $matches = void 0;

      $pattern = /{{ ([a-zA-Z0-9\_]+)\((.*)\) }}/gm;
      $subject = this.template;
      $matches;

      // Find all {{ xyz... }} tags
      $matches = (0, _preg_match_all2.default)($pattern, $subject);

      this.methods = $matches;
    }

    /**
     * [parseTags description]
     * @return [type]
     */

  }, {
    key: 'parseTags',
    value: function parseTags() {
      var $pattern = void 0,
          $subject = void 0,
          $matches = void 0;

      $pattern = /{% ([^%]+) ?%}/gm;
      $subject = this.template;
      $matches;

      // Find all {% ... %} tags
      $matches = (0, _preg_match_all2.default)($pattern, $subject);

      this.tags = $matches;
    }

    /**
     * [parseVariables description]
     * @return [type]
     */

  }, {
    key: 'parseVariables',
    value: function parseVariables() {
      var $pattern = void 0,
          $subject = void 0,
          $matches = void 0;

      $pattern = /{{ ([a-zA-Z0-9\_]+) }}/gm;
      $subject = this.template;
      $matches;

      // Find all {{ $... }} tags
      $matches = (0, _preg_match_all2.default)($pattern, $subject);

      this.variables = $matches;
    }
  }]);

  return Parser;
}();

exports.default = Parser;