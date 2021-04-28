
/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

const staticObject = {
    /**
     * HTML tags
     *
     * Value can have `tag` to return or
     * we can `convert` it to something else
     *
     * @var array
     */
    $tags: {
        'for '     : { 'tag' : 'for' },
        'endfor'   : { 'tag' : 'endfor' },
        'include ' : { 'tag' : 'include' },
        'if '      : { 'tag' : 'if' },
        'elseif '  : { 'tag' : 'elseif' },
        'else if ' : { 'tag' : 'elseif' },
        'else-if ' : { 'tag' : 'elseif' },
        'else'     : { 'tag' : 'else' },
        'endif'    : { 'tag' : 'endif' },
    }
}

/**
 * TagIdentifier
 *
 * The purpose of this class is to idenitfy and normalize different types
 * of tags.
 *
 * This is used by the converter to extract tags from identified statements:
 *
 *        Found: if matt == "true"
 *     Returned: matt == "true"
 *
 *        Found: endif
 *     Returned:
 */
export default class TagIdentifier
{
    /**
     * Try to identify tags
     *
     * The grabbed value is a section, like an innerValue,
     * which would be "include 'xyz' " as opposed to "{% include 'xyz' %}"
     *
     * @param  string $value
     *
     * @return string
     */
    static identify($value)
    {
        let $key, $options, $possibleKey;

        // Clean
        $value = TagIdentifier.fixString($value);

        for ($key in staticObject.$tags) {
            $options = staticObject.$tags[$key];
            $possibleKey = $value.substr(0, $key.length);

            if ($possibleKey === $key) {
                return $options['convert'] || $options['tag'];
            }
        }

        return '';
    }

    /**
     * Try to replace tags
     *
     * @param  string $value
     *
     * @return string
     */
    static replace($value)
    {
        let $identifiedTag;
        $identifiedTag = TagIdentifier.identify($value);

        const regex = new RegExp($identifiedTag + '[^a-zA-Z]', 'is');
        $value = $value.replace(regex, '');

        return TagIdentifier.fixString($value);
    }

    /**
     * Replace tags accidentally added
     *
     * @param  string $value
     *
     * @return string
     */
    static fixString($value)
    {
        $value = $value.replaceAll('{%', '');
        $value = $value.replaceAll('%}', '');
        $value = $value.trim();

        return $value;
    }
}
