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
exports.processMetadata = exports.augmentMetadata = exports.storeMetadata = exports.storeAniListMetadata = exports.getIds = void 0;
var _ = require("lodash");
var fs = require('fs');
var cliProgress = require('cli-progress');
var cross_fetch_1 = require("cross-fetch");
var types_1 = require("../ts/types");
var KEY = 'e0e691a27a61d8cca4d3446774022c20'; // please be responsible
function getIds() {
    return __awaiter(this, void 0, void 0, function () {
        var ids, i, url, response, json, _i, _a, show, uniqueIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Getting ids from MAL');
                    ids = [];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 6];
                    url = "https://api.myanimelist.net/v2/anime/ranking?ranking_type=bypopularity&limit=500&offset=".concat(i * 500);
                    return [4 /*yield*/, (0, cross_fetch_1["default"])(url, {
                            headers: {
                                'X-MAL-CLIENT-ID': KEY
                            }
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    json = _b.sent();
                    for (_i = 0, _a = json.data; _i < _a.length; _i++) {
                        show = _a[_i];
                        ids.push(show.node.id);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    uniqueIds = _.uniq(ids);
                    return [2 /*return*/, uniqueIds];
            }
        });
    });
}
exports.getIds = getIds;
function storeAniListMetadata(ids, filename) {
    if (ids === void 0) { ids = []; }
    if (filename === void 0) { filename = 'data/metadata-anilist.json'; }
    return __awaiter(this, void 0, void 0, function () {
        var metadata, bar, _i, ids_1, id, i, res, json, nodes, _a, nodes_1, node, rec, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    metadata = JSON.parse(fs.readFileSync(filename).toString());
                    console.log("".concat(_.size(metadata), " shows already have anilist metadata out of ").concat(ids.length));
                    bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
                    bar.start(ids.length - _.size(metadata), 0);
                    _i = 0, ids_1 = ids;
                    _b.label = 1;
                case 1:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 13];
                    id = ids_1[_i];
                    if (metadata[id]) {
                        return [3 /*break*/, 12];
                    }
                    bar.increment();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 9, , 10]);
                    metadata[id] = {};
                    i = 1;
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, cross_fetch_1["default"])("https://graphql.anilist.co", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            query: "{\n                            Media(idMal: ".concat(id, ") {\n                              recommendations(page: ").concat(i, ") {\n                                nodes {\n                                  mediaRecommendation {\n                                    idMal\n                                  }\n                                  rating\n                                }\n                              }\n                            }\n                          }\n                        ")
                        })
                    })];
                case 4:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 5:
                    json = _b.sent();
                    nodes = json.data.Media.recommendations.nodes
                        .filter(function (n) { var _a; return (_a = n.mediaRecommendation) === null || _a === void 0 ? void 0 : _a.idMal; });
                    for (_a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
                        node = nodes_1[_a];
                        rec = node.mediaRecommendation.idMal;
                        if (node.rating < 1) {
                            continue;
                        }
                        if (!metadata[id][rec]) {
                            metadata[id][rec] = 0;
                        }
                        metadata[id][rec] += node.rating;
                        // console.log(`${id} -> ${rec}`);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 6:
                    _b.sent();
                    if (nodes.length === 0) {
                        return [3 /*break*/, 8];
                    }
                    _b.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _b.sent();
                    console.log(e_1, id);
                    return [3 /*break*/, 10];
                case 10: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 11:
                    _b.sent();
                    if (_.size(metadata) % 20 === 1) {
                        fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
                    }
                    _b.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 1];
                case 13:
                    bar.stop();
                    fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
                    return [2 /*return*/, metadata];
            }
        });
    });
}
exports.storeAniListMetadata = storeAniListMetadata;
function storeMetadata(ids, filename) {
    if (ids === void 0) { ids = []; }
    if (filename === void 0) { filename = 'data/metadata.json'; }
    return __awaiter(this, void 0, void 0, function () {
        var metadata, bar, _i, ids_2, id, params, url, response, json, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadata = JSON.parse(fs.readFileSync(filename).toString());
                    console.log("".concat(_.size(metadata), " shows already have metadata out of ").concat(ids.length));
                    bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
                    bar.start(ids.length - _.size(metadata), 0);
                    _i = 0, ids_2 = ids;
                    _a.label = 1;
                case 1:
                    if (!(_i < ids_2.length)) return [3 /*break*/, 9];
                    id = ids_2[_i];
                    if (metadata[id]) {
                        return [3 /*break*/, 8];
                    }
                    bar.increment();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    params = 'title,alternative_titles,num_list_users,media_type,start_season,nsfw,synopsis,score,genres,rank,popularity,main_picture,related_anime,mean,recommendations';
                    url = "https://api.myanimelist.net/v2/anime/".concat(id, "?fields=").concat(params);
                    return [4 /*yield*/, (0, cross_fetch_1["default"])(url, {
                            headers: {
                                'X-MAL-CLIENT-ID': KEY
                            }
                        })];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    json = _a.sent();
                    metadata[id] = json;
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    console.log(e_2, id);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 7:
                    _a.sent();
                    if (_.size(metadata) % 20 === 1) {
                        fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
                    }
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
                    bar.stop();
                    fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
                    return [2 /*return*/, metadata];
            }
        });
    });
}
exports.storeMetadata = storeMetadata;
function filterMetadata(metadata) {
    var filtered = {};
    for (var id in metadata) {
        var show = metadata[id];
        if (show.score && ['tv'].includes(show.type) && !show.nsfw) {
            filtered[id] = show;
        }
    }
    // only keep most popular shows
    var keys = Object.keys(filtered)
        .filter(function (id) { return filtered[id].popularity < 4000; });
    return _.pick(filtered, keys);
}
function parseMetadata(json) {
    var _a, _b, _c, _d, _e, _f;
    return Object.assign(new types_1.ANIME_DATA(), {
        id: json.id,
        title: json.title,
        englishTitle: (_a = json.alternative_titles) === null || _a === void 0 ? void 0 : _a.en,
        url: 'https://myanimelist.net/anime/' + json.id,
        picture: (_b = json.main_picture) === null || _b === void 0 ? void 0 : _b.medium,
        synopsis: json.synopsis,
        type: json.media_type,
        score: json.mean,
        genres: (_c = json.genres) === null || _c === void 0 ? void 0 : _c.map(function (g) { return g.name; }),
        ranked: json.rank,
        popularity: json.popularity,
        members: json.num_list_users,
        related: (_d = json.related_anime) === null || _d === void 0 ? void 0 : _d.map(function (r) { return ({
            id: r.node.id,
            relation_type: r.relation_type
        }); }),
        recommendations: (_e = json.recommendations) === null || _e === void 0 ? void 0 : _e.map(function (r) { return ({ id: r.node.id, count: r.num_recommendations }); }),
        year: (_f = json.start_season) === null || _f === void 0 ? void 0 : _f.year,
        nsfw: !['white', 'gray'].includes(json.nsfw)
    });
}
function augmentMetadata(metadata, anilist_metadata) {
    for (var id in anilist_metadata) {
        var ani_recs = anilist_metadata[id];
        var recs = metadata[id].recommendations;
        var _loop_1 = function (rec) {
            var fnd = recs.find(function (r) { return r.id === parseInt(rec); });
            if (fnd) {
                fnd.count += ani_recs[rec];
            }
            else {
                recs.push({ id: parseInt(rec), count: ani_recs[rec] });
            }
        };
        for (var rec in ani_recs) {
            _loop_1(rec);
        }
    }
    return metadata;
}
exports.augmentMetadata = augmentMetadata;
function mergeSeasons(data) {
    // merge shows related by prequel/sequel into the most popular show
    var canonical_ids = _.mapValues(data, getCanonicalSeason);
    for (var id in data) {
        var canonical_id = canonical_ids[id];
        if (canonical_id !== _.toInteger(id)) {
            // merge reccomendations
            var recs = data[id].recommendations;
            if (recs) {
                if (!data[canonical_id].recommendations) {
                    data[canonical_id].recommendations = [];
                }
                data[canonical_id].recommendations = data[canonical_id].recommendations.concat(recs);
            }
        }
    }
    var merged = {};
    var _loop_2 = function (id) {
        var canonical_id = canonical_ids[id];
        if (canonical_id === _.toInteger(id)) {
            var keys = _.uniq(data[id].recommendations.map(function (r) { return canonical_ids[r.id]; })).filter(function (id) { return id; });
            data[id].recommendations = keys.map(function (k) { return ({
                id: k,
                count: data[id].recommendations.filter(function (r) { return canonical_ids[r.id] === k; }).reduce(function (a, b) { return a + b.count; }, 0)
            }); });
            merged[id] = data[id];
        }
    };
    for (var id in data) {
        _loop_2(id);
    }
    return merged;
    function getCanonicalSeason(show) {
        if (!show.related) {
            return show.id;
        }
        var related = [show.id];
        while (true) {
            var newRelated = [];
            for (var _i = 0, related_1 = related; _i < related_1.length; _i++) {
                var id = related_1[_i];
                if (!data[id] || !data[id].related)
                    continue;
                var relatedTo = data[id].related.filter(function (r) { return r.relation_type === 'sequel' || r.relation_type === 'prequel'; });
                if (relatedTo) {
                    newRelated = newRelated.concat(relatedTo.map(function (r) { return r.id; }));
                }
                newRelated.push(id);
            }
            newRelated = _.uniq(newRelated).filter(function (id) { return data[id]; });
            if (newRelated.length === related.length) {
                break;
            }
            related = newRelated;
        }
        related = related.filter(function (id) { return data[id] && data[id].score; });
        if (related.length < 2)
            return show.id;
        return _.minBy(related, function (id) { return data[id].popularity; });
    }
}
function processMetadata(metadata, anilist_metadata) {
    var data = augmentMetadata(_.mapValues(metadata, parseMetadata), anilist_metadata);
    console.log("".concat(_.size(data), " shows have metadata"));
    var merged = mergeSeasons(data);
    console.log("".concat(_.size(merged), " shows after merging seasons"));
    var filtered = filterMetadata(merged);
    console.log("".concat(_.size(filtered), " shows filtered"));
    fs.writeFileSync('data/min_metadata.json', JSON.stringify(filtered, null, 2));
    return filtered;
}
exports.processMetadata = processMetadata;
