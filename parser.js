
/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

const fs = require('fs');
const preg_match_all = require('./polyfill/preg_match_all.js');

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
class Parser
{
    /**
     * Twig comments found
     *
     * @var array
     */
    $comments;

    /**
     * Twig methods found
     *
     * @var array
     */
    $methods;

    /**
     * Twig tags found
     *
     * @var array
     */
    $tags;

    /**
     * Template to parse
     *
     * @var string
     */
    $template;

    /**
     * Constructor
     *
     * @param string $template
     */
    constructor($template = '')
    {
        // Force html
        if ($template.match(/\.twig$/)) {
            this.import($template);
        }
        else {
            this.setHtml($template);
        }
    }

    /**
     * Get source file
     *
     * @param  string $filename
     *
     * @return string
     */
    import($filename = '')
    {
        return this.setHtml(require($filename));
    }

    /**
     * Set markup
     *
     * @param  string $html
     *
     * @return string
     */
    setHtml($html)
    {
        return this.template = $html;
    }

    /**
     * Parse Twig Tags
     *
     * @param  string
     * @return void
     */
    parse()
    {
        this.parseComments();
        this.parseMethods();
        this.parseTags();
        this.parseVariables();
    }

    /**
     * [parseComments description]
     * @return [type]
     */
    parseComments()
    {
        let $pattern, $subject, $matches;

        $pattern = /{\# ([^#]+) ?\#}/gm;
        $subject = this.template;
        $matches;

        // Find all {# ... #} tags
        $matches = preg_match_all($pattern, $subject);

        this.comments = $matches;
    }

    /**
     * [parseMethods description]
     * @return [type]
     */
    parseMethods()
    {
        let $pattern, $subject, $matches;

        $pattern = /{{ ([a-zA-Z0-9\_]+)\((.*)\) }}/gm;
        $subject = this.template;
        $matches;

        // Find all {{ xyz... }} tags
        $matches = preg_match_all($pattern, $subject);

        this.methods = $matches;
    }

    /**
     * [parseTags description]
     * @return [type]
     */
    parseTags()
    {
        let $pattern, $subject, $matches;

        $pattern = /{% ([^%]+) ?%}/gm;
        $subject = this.template;
        $matches;

        // Find all {% ... %} tags
        $matches = preg_match_all($pattern, $subject);

        this.tags = $matches;
    }

    /**
     * [parseVariables description]
     * @return [type]
     */
    parseVariables()
    {
        let $pattern, $subject, $matches;

        $pattern = /{{ ([a-zA-Z0-9\_]+) }}/gm;
        $subject = this.template;
        $matches;

        // Find all {{ $... }} tags
        $matches = preg_match_all($pattern, $subject);

        this.variables = $matches;
    }
}


// For testing
// ----------------------------------------------------------------------------

require.extensions['.twig'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

if (require.main === module) {
    // const str = `<div>
    //     {# Test Comment #}
    //     <h3>Title</h3>
    //     {{ foo }}
    // </div>`;
    // const str = './data/kitchen-sink.twig';
    const str = './data/basic-comments.twig';

    const parser = new Parser(str);
    parser.parse();

    console.log('Comments', parser.comments);
    console.log('Methods', parser.methods);
    console.log('Tags', parser.tags);
    console.log('Variables', parser.variables);
}
else {
    module.exports = Parser;
}
