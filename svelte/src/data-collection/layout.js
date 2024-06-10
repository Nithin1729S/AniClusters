"use strict";
exports.__esModule = true;
exports.Layout = void 0;
var d3_force_1 = require("d3-force");
var d3_force_reuse_1 = require("d3-force-reuse");
var _ = require("lodash");
var Node = /** @class */ (function () {
    function Node(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.hue = 0;
    }
    Node.prototype.norm = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Node;
}());
var Edge = /** @class */ (function () {
    function Edge(source, target, weight) {
        this.source = source;
        this.target = target;
        this.weight = weight;
    }
    return Edge;
}());
var Layout = /** @class */ (function () {
    function Layout(clusters, edges, min_colors) {
        if (min_colors === void 0) { min_colors = 20; }
        this.edges = [];
        this.simulation = (0, d3_force_1.forceSimulation)([]).stop();
        this.done = false;
        this.tier = 0;
        this.Clusters = clusters;
        this.Cluster_Nodes = _.mapValues(clusters, function (cluster) { return cluster.slice(0, -1); });
        this.initClusterMap();
        this.min_colors = min_colors;
        this.Edges = edges;
    }
    Layout.prototype.tick = function (iters) {
        if (iters === void 0) { iters = 1; }
        if (this.simulation.alpha() < 0.01) {
            this.simulation.stop();
            this.done = true;
            return;
        }
        for (var i = 0; i < iters; i++) {
            this.simulation.tick();
        }
        this.normalizeDensity();
        if (this.tier <= this.max_tier() && this.simulation.alpha() < 0.05) {
            var nodes = this.simulation.nodes();
            nodes = this.newClusterNodes(nodes, this.tier);
            var edges = this.getClusterEdges(this.tier, nodes);
            this.tier++;
            console.log("Laying out cluster tier ".concat(this.tier, "..."));
            this.simulation.nodes(nodes);
            this.simulation.force("link", (0, d3_force_1.forceLink)(edges)
                .strength(function (link) {
                return link.weight;
            })
                .distance(50));
            this.simulation.force("charge", (0, d3_force_reuse_1.forceManyBodyReuse)()
                .strength(-50));
            this.simulation.alphaDecay(0.0015);
            this.simulation.alpha(0.25).restart();
        }
    };
    Layout.prototype.normalizeDensity = function (target_density) {
        if (target_density === void 0) { target_density = 0.00007; }
        var nodes = this.simulation.nodes();
        var max_norm = _.max(nodes.map(function (node) { return node.norm(); }));
        var area = Math.PI * max_norm * max_norm;
        var target_area = nodes.length / target_density;
        var norm_scale = Math.sqrt(target_area / area);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            node.x *= norm_scale;
            node.y *= norm_scale;
        }
    };
    Layout.prototype.max_tier = function () {
        return this.Clusters[1].length - 1;
    };
    Layout.prototype.initClusterMap = function () {
        for (var _i = 0, _a = Object.entries(this.Clusters); _i < _a.length; _i++) {
            var _b = _a[_i], node_id = _b[0], cluster_ids = _b[1];
            var clusters = _.uniq(cluster_ids);
            for (var _c = 0, clusters_1 = clusters; _c < clusters_1.length; _c++) {
                var cluster_id = clusters_1[_c];
                if (!(cluster_id in this.Cluster_Nodes)) {
                    this.Cluster_Nodes[cluster_id] = [];
                }
                this.Cluster_Nodes[cluster_id].push(parseInt(node_id));
            }
        }
    };
    Layout.prototype.assignHues = function (nodes, min_hue, max_hue) {
        var _a;
        var _this = this;
        var range = max_hue - min_hue;
        var sorted = nodes.sort(function (a, b) { return _this.Cluster_Nodes[a.id].length - _this.Cluster_Nodes[b.id].length; });
        // shuffle the last n-2 elements
        var shuffled = _.shuffle(sorted.slice(2));
        shuffled = sorted.slice(0, 2).concat(shuffled);
        // swap the second element with the middle element
        var middle = Math.floor(shuffled.length / 2);
        _a = [shuffled[middle], shuffled[1]], shuffled[1] = _a[0], shuffled[middle] = _a[1];
        for (var i = 0; i < shuffled.length; i++) {
            shuffled[i].hue = range * i / shuffled.length + min_hue;
        }
    };
    Layout.prototype.getCluster = function (id, tier) {
        if (tier < 0)
            tier = this.Clusters[id].length + tier;
        return this.Clusters[id][tier];
    };
    Layout.prototype.newClusterNodes = function (old_nodes, tier) {
        if (tier === 0) {
            var ids_1 = _.uniq(_.values(this.Clusters).flatMap(function (v) { return v[0]; }));
            return ids_1.map(function (id) { return new Node(id); });
        }
        var ids = _.uniq(_.values(this.Clusters).flatMap(function (v) { return v[tier]; }));
        var parents = {};
        for (var _i = 0, _a = Object.entries(this.Clusters); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], cluster = _b[1];
            parents[cluster[tier]] = cluster[tier - 1];
        }
        var scale = 1;
        var nodes = ids.map(function (id) {
            var node = old_nodes.find(function (n) { return n.id === parents[id]; });
            var new_node = new Node(id);
            new_node.x = node.x * scale + jiggle();
            new_node.y = node.y * scale + jiggle();
            new_node.hue = node.hue;
            return new_node;
        });
        if (old_nodes.length < this.min_colors && nodes.length >= this.min_colors) {
            this.assignHues(nodes, 0, 360);
        }
        return nodes;
        function jiggle() {
            return (Math.random() - 0.5) * 10;
        }
    };
    Layout.prototype.getClusterEdges = function (tier, nodes) {
        var _this = this;
        var node_dict = {};
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            node_dict[node.id] = node;
        }
        var edge_dict = {};
        for (var _a = 0, _b = this.Edges; _a < _b.length; _a++) {
            var edge = _b[_a];
            var a = edge[0], b = edge[1], weight = edge[2];
            var s = this.getCluster(a, tier);
            var t = this.getCluster(b, tier);
            if (s === t) {
                continue;
            }
            if (tier > 1) {
                if (this.getCluster(a, tier - 2) !== this.getCluster(b, tier - 2)) {
                    continue;
                }
            }
            if (tier > 0) {
                var ps = this.getCluster(a, tier - 1);
                var pt = this.getCluster(b, tier - 1);
                if (ps !== pt) {
                    weight /= 30;
                }
            }
            var key = (s < t) ? "".concat(s, "-").concat(t) : "".concat(t, "-").concat(s);
            if (key in edge_dict) {
                edge_dict[key] += weight;
            }
            else {
                edge_dict[key] = weight;
            }
        }
        // normalize weights
        var max_weight = _.max(_.values(edge_dict));
        _.forEach(edge_dict, function (weight, key) {
            if (tier === _this.max_tier()) {
                edge_dict[key] = Math.sqrt(weight) / 3;
            }
            else {
                edge_dict[key] = weight / max_weight;
            }
        });
        this.edges = [];
        for (var key in edge_dict) {
            var _c = key.split('-').map(function (v) { return parseInt(v); }), s = _c[0], t = _c[1];
            this.edges.push(new Edge(node_dict[s], node_dict[t], edge_dict[key]));
        }
        return this.edges;
    };
    Layout.prototype.toJSON = function () {
        var positions = {};
        for (var _i = 0, _a = this.simulation.nodes(); _i < _a.length; _i++) {
            var node = _a[_i];
            positions[node.id] = {
                x: node.x,
                y: node.y,
                hue: node.hue
            };
        }
        var edges = [];
        for (var _b = 0, _c = this.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            edges.push([edge.source.id, edge.target.id, edge.weight]);
        }
        return { nodes: positions, edges: edges };
    };
    return Layout;
}());
exports.Layout = Layout;
