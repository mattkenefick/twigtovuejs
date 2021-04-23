
import jsdom from 'jsdom';

export default class QueryPath {
    dom;

    /**
     * Initialize
     */
    constructor(xml) {
        typeof(xml) == 'string'
            ? this.fromString(xml)
            : this.fromObject(xml);
    }

    /**
     * Get text from object
     */
    attr(key, val) {
        return val !== undefined
            ? this.json[key] = val
            : this.json[key];
    }

    /**
     * Create tag with attributes
     */
    createWith(tag, attributes)
    {
        const element = this.dom.window.document.createElement(tag);

        for (var i = 0, l = (attributes || []).length; i < l; i++) {
            const key = attributes.item(i).name;
            const value = attributes.item(i).nodeValue;

            element.setAttribute(key, value);
         }

        return element;
    }

    /**
     * Alias for query
     */
    find(query) {
        return this.dom.window.document.querySelector(query);
    }

    /**
     *
     */
    findAll(query) {
        return this.dom.window.document.querySelectorAll(query);
    }

    /**
     * Return as HTML
     */
    html() {
        return this.toString();
    }

    /**
     * Get text from object
     */
    text() {
        return this['$t'];
    }

    unwrap(wrapper) {
        // place childNodes in document fragment
        var docFrag = this.dom.window.document.createDocumentFragment();

        while (wrapper.firstChild) {
            var child = wrapper.removeChild(wrapper.firstChild);
            docFrag.appendChild(child);
        }

        // replace wrapper with document fragment
        wrapper.parentNode.replaceChild(docFrag, wrapper);
    }

    /**
     * Set JSON from string
     */
    fromString(xml) {
        return this.dom = new jsdom.JSDOM(xml);
    }

    /**
     * Convert JSON object to XML
     */
    toString() {
        return this.dom.window.document.body.innerHTML;
    }
}
