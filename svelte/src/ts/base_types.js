"use strict";
exports.__esModule = true;
exports.METADATA = void 0;
var METADATA = /** @class */ (function () {
    function METADATA() {
    }
    METADATA.prototype.canonicalTitle = function () {
        return this.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    };
    return METADATA;
}());
exports.METADATA = METADATA;
;
