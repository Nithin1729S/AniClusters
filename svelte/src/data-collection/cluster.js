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
exports.createCluster = exports.Cluster = void 0;
var _ = require("lodash");
var Cluster = /** @class */ (function () {
    function Cluster(id, tier, nodes) {
        if (nodes === void 0) { nodes = []; }
        this.nodes = [];
        this.clusters = [];
        this.id = id;
        this.tier = tier;
        this.nodes = nodes;
        Cluster.max_id = Math.max(id, Cluster.max_id);
    }
    Cluster.setEdges = function (edges) {
        Cluster.adj_list = {};
        for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
            var e = edges_1[_i];
            Cluster.adj_list[e[0]] = Cluster.adj_list[e[0]] || [];
            Cluster.adj_list[e[0]].push(e[1]);
            Cluster.adj_list[e[1]] = Cluster.adj_list[e[1]] || [];
            Cluster.adj_list[e[1]].push(e[0]);
        }
    };
    Cluster.prototype.insert = function (id, levels) {
        if (levels.length === 0) {
            this.nodes.push(id);
        }
        else {
            var c = _.find(this.clusters, function (c) { return c.id === levels[0]; });
            if (c) {
                c.insert(id, levels.slice(1));
            }
            else {
                var cluster = new Cluster(levels[0], this.tier + 1);
                cluster.insert(id, levels.slice(1));
                this.clusters.push(cluster);
            }
        }
    };
    Cluster.prototype.size = function () {
        return this.nodes.length + this.clusters.reduce(function (a, b) { return a + b.size(); }, 0);
    };
    Cluster.prototype.allNodes = function () {
        return this.nodes.concat(this.clusters.reduce(function (a, b) { return a.concat(b.allNodes()); }, []));
    };
    Cluster.prototype.distance = function (cluster) {
        var nodes = this.allNodes();
        var other_nodes = cluster.allNodes();
        var num_potential_edges = nodes.length * other_nodes.length;
        var edges_found = 0;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var n = nodes_1[_i];
            for (var _a = 0, other_nodes_1 = other_nodes; _a < other_nodes_1.length; _a++) {
                var o = other_nodes_1[_a];
                if (Cluster.adj_list[n].includes(o)) {
                    edges_found++;
                }
            }
        }
        return edges_found / num_potential_edges;
    };
    Cluster.prototype.addCluster = function (cluster) {
        cluster.tier = this.tier + 1;
        this.clusters.push(cluster);
    };
    Cluster.prototype.merge = function (min_prop, min_size) {
        var _this = this;
        if (min_prop === void 0) { min_prop = 0.15; }
        if (min_size === void 0) { min_size = 10; }
        var threshold = Math.max(min_size, this.size() * min_prop);
        if (this.size() < threshold) {
            throw new Error("Cluster is too small to merge");
        }
        if (this.nodes.length > 0 && this.clusters.length > 0) {
            this.addCluster(new Cluster(Cluster.max_id + 1, this.tier + 1, this.nodes));
            this.nodes = [];
        }
        if (this.size() < threshold) {
            this.clusters.forEach(function (c) {
                var _a;
                return (_a = _this.nodes).push.apply(_a, c.allNodes());
            });
            this.clusters = [];
            return;
        }
        while (this.clusters.length > 2) {
            if (this.clusters.length === 0)
                break;
            this.clusters.sort(function (a, b) { return a.size() - b.size(); });
            var smallest = this.clusters[0];
            if (smallest.size() >= threshold)
                break;
            this.clusters.shift();
            var closest = _.minBy(this.clusters, function (c) { return _this.distance(c); });
            closest === null || closest === void 0 ? void 0 : closest.addCluster(smallest);
        }
        var cluster_sizes = this.clusters.map(function (c) { return c.size(); });
        var min_csize = _.min(cluster_sizes) || 0;
        if (this.clusters.length > 0 && min_csize <= threshold) {
            this.clusters.forEach(function (c) {
                var _a;
                return (_a = _this.nodes).push.apply(_a, c.allNodes());
            });
            this.clusters = [];
        }
        for (var _i = 0, _a = this.clusters; _i < _a.length; _i++) {
            var cluster = _a[_i];
            cluster.merge(min_prop, min_size);
        }
    };
    Cluster.prototype.toNodeDict = function () {
        var json = {};
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            json[node] = [node];
        }
        for (var i = 0; i < this.clusters.length; i++) {
            json = Object.assign(json, this.clusters[i].toNodeDict());
        }
        // pad shorter arrays
        var max_len = _.max(_.map(json, function (arr) { return arr.length; })) || 0;
        for (var _b = 0, _c = Object.entries(json); _b < _c.length; _b++) {
            var _d = _c[_b], id = _d[0], clusters = _d[1];
            while (clusters.length <= max_len) {
                clusters.splice(0, 0, this.id);
            }
        }
        return json;
    };
    Cluster.prototype.toJSON = function () {
        var json = {
            id: this.id,
            tier: this.tier,
            nodes: this.nodes,
            clusters: this.clusters.map(function (c) { return c.toJSON(); })
        };
        return json;
    };
    Cluster.fromJSON = function (json) {
        var cluster = new Cluster(json.id, json.tier, json.nodes);
        cluster.clusters = json.clusters.map(function (c) { return Cluster.fromJSON(c); });
        return cluster;
    };
    Cluster.max_id = 0;
    return Cluster;
}());
exports.Cluster = Cluster;
var child_process = require("child_process");
var fs = require("fs");
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
    var exec = child_process.exec;
    return new Promise(function (resolve, reject) {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
function createCluster(edges, edgePath, clusterPath) {
    if (edgePath === void 0) { edgePath = 'data/edges.txt'; }
    if (clusterPath === void 0) { clusterPath = 'data/clusters.json'; }
    return __awaiter(this, void 0, void 0, function () {
        var out, start, root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    out = edges
                        .map(function (e) { return "".concat(e[0], " ").concat(e[1], " ").concat(e[2]); })
                        .join('\n');
                    fs.writeFileSync(edgePath, out);
                    console.log('Creating clusters...');
                    start = Date.now();
                    return [4 /*yield*/, execShellCommand("python3 cluster.py ".concat(edgePath, " ").concat(clusterPath))];
                case 1:
                    _a.sent();
                    console.log("Clustering took ".concat((Date.now() - start) / 1000, "s"));
                    // Process clusters
                    console.log('Merging small clusters...');
                    Cluster.setEdges(edges);
                    root = Cluster.fromJSON(JSON.parse(fs.readFileSync(clusterPath, 'utf8')));
                    root.merge();
                    // Write clusters to file
                    fs.writeFileSync(clusterPath, JSON.stringify(root.toJSON()));
                    return [2 /*return*/, root];
            }
        });
    });
}
exports.createCluster = createCluster;
