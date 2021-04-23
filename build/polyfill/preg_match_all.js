"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = preg_match_all;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function preg_match_all(regex, str) {
    // eslint-disable-line camelcase
    var matches = [].concat(_toConsumableArray(str.matchAll(regex)));
    var output = [];

    matches.forEach(function (item) {
        item.forEach(function (value, index) {
            output[index] = output[index] || [];
            output[index].push(value);
        });
    });

    return output;
}