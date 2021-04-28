
import jsdom from 'jsdom';

export default class QueryPath {
    /**
     * Initialize
     */
    constructor(xml) {
        typeof(xml) == 'string'
            ? this.fromString(xml)
            : this.fromObject(xml);
    }

    document() {
        // return this.dom;
        return this.dom.window.document;
    }

    body() {
        // return this.dom;
        return this.dom.window.document.body;
    }

    /**
     * Create tag with attributes
     */
    createWith(tag, attributes)
    {
        const element = this.document().createElement(tag);

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
        return this.document().querySelector(query);
    }

    /**
     *
     */
    findAll(query) {
        return this.document().querySelectorAll(query);
    }

    /**
     * Return as HTML
     */
    html() {
        return this.toString();
    }

    /**
     * Remove element from DOM, keep children
     */
    unwrap(wrapper) {
        var docFrag = this.document().createDocumentFragment();

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
        // const element = document.createElement('div');
        // element.innerHTML = xml;
        // return this.dom = element;

        return this.dom = new jsdom.JSDOM(xml);
    }

    /**
     * Convert JSON object to XML
     */
    toString() {
        return this.body().innerHTML;
    }
}
