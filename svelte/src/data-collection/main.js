"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var cluster_1 = require("./cluster");
var layout_1 = require("./layout");
var recs_1 = require("./recs");
var shows_1 = require("./shows");
var fs = require('fs');
var MAL_METADATA_FILENAME = 'data/metadata.json';
var ANILIST_METADATA_FILENAME = 'data/metadata-anilist.json';
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ids, metadata_json, anilist_metadata_json, metadata, edges, root_cluster, layout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(process.argv.length === 3 && process.argv[2] === 'reset')) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, shows_1.getIds)()];
                case 1:
                    ids = _a.sent();
                    fs.writeFileSync(MAL_METADATA_FILENAME, '{}');
                    fs.writeFileSync(ANILIST_METADATA_FILENAME, '{}');
                    return [4 /*yield*/, (0, shows_1.storeMetadata)(ids)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, shows_1.storeAniListMetadata)(ids)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    metadata_json = JSON.parse(fs.readFileSync(MAL_METADATA_FILENAME).toString());
                    anilist_metadata_json = JSON.parse(fs.readFileSync(ANILIST_METADATA_FILENAME).toString());
                    metadata = (0, shows_1.processMetadata)(metadata_json, anilist_metadata_json);
                    edges = (0, recs_1.storeEdges)(metadata);
                    return [4 /*yield*/, (0, cluster_1.createCluster)(edges)];
                case 5:
                    root_cluster = _a.sent();
                    console.log("Finished clustering");
                    // Layout clusters
                    console.log("Starting layout");
                    layout = new layout_1.Layout(root_cluster.toNodeDict(), edges, 20);
                    while (!layout.done) {
                        layout.tick();
                    }
                    fs.writeFileSync('data/layout.json', JSON.stringify(layout, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
