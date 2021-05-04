"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsdom = _interopRequireDefault(require("jsdom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var QueryPath = /*#__PURE__*/function () {
  /**
   * Initialize
   */
  function QueryPath(xml) {
    _classCallCheck(this, QueryPath);

    typeof xml == 'string' ? this.fromString(xml) : this.fromObject(xml);
  }

  _createClass(QueryPath, [{
    key: "document",
    value: function document() {
      // return this.dom;
      return this.dom.window.document;
    }
  }, {
    key: "body",
    value: function body() {
      // return this.dom;
      return this.dom.window.document.body;
    }
    /**
     * Create tag with attributes
     */

  }, {
    key: "createWith",
    value: function createWith(tag, attributes) {
      var element = this.document().createElement(tag);

      for (var i = 0, l = (attributes || []).length; i < l; i++) {
        var key = attributes.item(i).name;
        var value = attributes.item(i).nodeValue;
        element.setAttribute(key, value);
      }

      return element;
    }
    /**
     * Alias for query
     */

  }, {
    key: "find",
    value: function find(query) {
      return this.document().querySelector(query);
    }
    /**
     *
     */

  }, {
    key: "findAll",
    value: function findAll(query) {
      return this.document().querySelectorAll(query);
    }
    /**
     * Return as HTML
     */

  }, {
    key: "html",
    value: function html() {
      return this.toString();
    }
    /**
     * Remove element from DOM, keep children
     */

  }, {
    key: "unwrap",
    value: function unwrap(wrapper) {
      var docFrag = this.document().createDocumentFragment();

      while (wrapper.firstChild) {
        var child = wrapper.removeChild(wrapper.firstChild);
        docFrag.appendChild(child);
      } // replace wrapper with document fragment


      wrapper.parentNode.replaceChild(docFrag, wrapper);
    }
    /**
     * Set JSON from string
     */

  }, {
    key: "fromString",
    value: function fromString(xml) {
      // const element = document.createElement('div');
      // element.innerHTML = xml;
      // return this.dom = element;
      return this.dom = new _jsdom["default"].JSDOM(xml);
    }
    /**
     * Convert JSON object to XML
     */

  }, {
    key: "toString",
    value: function toString() {
      return this.body().innerHTML;
    }
  }]);

  return QueryPath;
}();

exports["default"] = QueryPath;