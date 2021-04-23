
/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

import fs from 'fs';
import preg_match_all from './polyfill/preg_match_all.js';

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
export default class Parser
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
