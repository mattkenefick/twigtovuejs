"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = preg_replace_callback;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function preg_replace_callback(pattern, callback, string) {
    [].concat(_toConsumableArray(string.matchAll(pattern))).forEach(function (value) {
        string = string.replace(value[0], callback(value));
    });

    return string;
}