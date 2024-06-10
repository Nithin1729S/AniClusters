"use strict";
exports.__esModule = true;
exports.storeEdges = void 0;
var _ = require("lodash");
var fs = require('fs');
function storeEdges(metadata, filename) {
    if (filename === void 0) { filename = 'data/edges.json'; }
    var edges = getEdges(metadata)
        .filter(function (e) { return e[2] > 0.03; })
        .sort(function (a, b) { return b[0] - a[1]; });
    var out = edges
        .map(function (e) { return [e[0], e[1], e[2].toPrecision(3)]; });
    fs.writeFileSync(filename, JSON.stringify({ "Edges": out }));
    return edges;
}
exports.storeEdges = storeEdges;
function getEdges(metadatas) {
    var edge_dict = {};
    function addToEdge(a, b, w) {
        if (!metadatas[b] || !metadatas[a]) {
            return null;
        }
        var s = Math.min(a, b);
        var t = Math.max(a, b);
        var eid = "".concat(s, "-").concat(t);
        if (!edge_dict[eid]) {
            edge_dict[eid] = [s, t, 0];
        }
        edge_dict[eid][2] += w;
    }
    for (var _i = 0, _a = Object.entries(metadatas); _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], metadata = _b[1];
        var recs = metadata.recommendations;
        var total_recs = _.sumBy(recs, function (r) { return r.count; });
        for (var _c = 0, _d = _.values(recs); _c < _d.length; _c++) {
            var rec = _d[_c];
            addToEdge(parseInt(id), rec.id, rec.count / total_recs / 2);
        }
    }
    return _.values(edge_dict);
}
