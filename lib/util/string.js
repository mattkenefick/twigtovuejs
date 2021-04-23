
import preg_replace from '../polyfill/preg_replace.js';

/**
 * String
 */
export default class StringUtility
{
    /**
     * Get between two integer points
     *
     * @param  $str
     * @param  $start Starting string
     * @param  $end   Ending string
     * @return string
     */
    static between($str, $start, $end, $fromEnd = false)
    {
        let $length, $index;

        $str = ' ' + $str;
        $index = $str.indexOf($start);

        if ($index == 0) {
            return '';
        }

        $index += $start.length;
        $length = $fromEnd
            ? $str.substr($index).lastIndexOf($end)
            : $str.indexOf($end, $index) - $index;

        return $str.substr($index, $length);
    }

    /**
     * Remove tags
     *
     * @param  $str
     * @return string
     */
    static removeTags($str)
    {
        return preg_replace(/({{|}})/mg, '', $str).trim();
    }
}
