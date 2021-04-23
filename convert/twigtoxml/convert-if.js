
import preg_quote from '../../polyfill/preg_quote.js';
import preg_replace from '../../polyfill/preg_replace.js';

/**
 * JS imports are yelling about using these as static variables
 * on the class due to loaders. So we moved it out.
 *
 * ERROR in ./node_modules/twigtovuejs/convert/twigtoxml/convert-if.js 15:18
 * Module parse failed: Unexpected token (15:18)
 * You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
 * |      * @var int
 * |      *
 * >     static $depth = 0;
 *
 */
const staticObject = {
    $depth: 0,
    $tagHistory: [],
}

/**
 * Converter
 */
export default class ConvertIf
{
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
    static convert($str, $tag, $outerValue, $attributeValue)
    {
        switch ($tag) {
            case 'if':
                return ConvertIf.convertIf($str, $outerValue, $attributeValue);

            case 'elseif':
                return ConvertIf.convertElseIf($str, $outerValue, $attributeValue);

            case 'else':
                return ConvertIf.convertElse($str, $outerValue, $attributeValue);

            case 'endif':
                return ConvertIf.convertEndIf($str, $outerValue, $attributeValue);
        }
    }

    /**
     * Convert If
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertIf($str, $outerValue, $attributeValue)
    {
        let $previousTag, $value;

        // $previousTag = ConvertIf.getPreviousTag();
        $previousTag = staticObject.$tagHistory[staticObject.$tagHistory.length - 1] != 'if'
            ? ConvertIf.getPreviousTag()
            : '';
        $attributeValue = ConvertIf.cleanAttributes($attributeValue);
        $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<if condition="' + $attributeValue + '">', $str);

        // increase depth
        staticObject.$depth++;

        // add conditional to history
        ConvertIf.addPreviousTag('if');

        return $value;
    }

    /**
     * Convert ElseIf
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertElseIf($str, $outerValue, $attributeValue)
    {
        let $previousTag, $value;

        $previousTag = ConvertIf.getPreviousTag();
        $attributeValue = ConvertIf.cleanAttributes($attributeValue);
        $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<elseif condition="' + $attributeValue + '">', $str);

        // add conditional to history
        ConvertIf.addPreviousTag('elseif');

        return $value;
    }

    /**
     * Convert Else
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertElse($str, $outerValue, $attributeValue)
    {
        let $previousTag, $value;

        $previousTag = ConvertIf.getPreviousTag();
        $attributeValue = ConvertIf.cleanAttributes($attributeValue);
        $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<else condition="' + $attributeValue + '">', $str);

        // add conditional to history
        ConvertIf.addPreviousTag('else');

        return $value;
    }

    /**
     * Convert End If
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertEndIf($str, $outerValue, $attributeValue)
    {
        let $previousTag, $value;

        $previousTag = ConvertIf.getPreviousTag();

        $value = ConvertIf.str_replace_first($outerValue, $previousTag, $str);

        // $value = str_replace($outerValue, $previousTag + "\n", $str);
        // switch ($previousTag) {
        //     case '</else>':
        //         $value = str_replace($outerValue, '</else>', $str);
        //         break;

        //     case '</elseif>':
        //         $value = str_replace($outerValue, '</elseif>', $str);
        //         break;

        //     default:
        //     case '</if>':
        //         $value = str_replace($outerValue, '</if>', $str);
        //         break;
        // }

        // decrease depth
        staticObject.$depth--;

        // Unset previous tag because block is closed
        // ConvertIf.$previousTag = null;

        return $value;
    }

    /**
     * Clean attribute values
     *
     * XML validation specifically has an issue with "<" even when
     * wrapped within quotes. Safer here to just convert both.
     *
     * @return string
     */
    static cleanAttributes($attributeValue)
    {
        $attributeValue = $attributeValue.replaceAll("'", "\'");
        $attributeValue = $attributeValue.replaceAll('"', '\'');
        $attributeValue = $attributeValue.replaceAll('<', '&lt;');
        $attributeValue = $attributeValue.replaceAll('>', '&gt;');

        return $attributeValue;
    }

    /**
     * Return closing tag if necessary
     *
     * @return string
     */
    static addPreviousTag($tag)
    {
        // echo ' o tag = ' + $tag + "   (" + implode(', ', staticObject.$tagHistory) + ") \n";
        staticObject.$tagHistory.push($tag);
    }

    /**
     * Return closing tag if necessary
     *
     * @return string
     */
    static getPreviousTag()
    {
        let $tag;

        if (staticObject.$tagHistory.length) {
            // echo ' x ' + (end(staticObject.$tagHistory)) + "   {" + implode(', ', staticObject.$tagHistory) + "} \n";
            $tag = staticObject.$tagHistory.pop();
            return '</' + $tag + '>';
        }

        return '';
    }

    /**
     * Replace only first instance
     *
     * @param  string $from
     * @param  string $to
     * @param  string $content
     * @return string
     */
    static str_replace_first($from, $to, $content)
    {
        $from = '/' + preg_quote($from, '#') + '/';

        return preg_replace($from, $to, $content || '', 1);
    }
}
