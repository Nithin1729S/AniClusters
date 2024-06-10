<script lang="ts">
    import AnimeView from "./AnimeView.svelte";
    import Canvas from "./Canvas.svelte";
    import LangButton from "./LangButton.svelte";
    import Searchbar from "./Searchbar.svelte";
    import Sidebar from "./Sidebar.svelte";
    import SidebarHeader from "./SidebarHeader.svelte";
    import { Metadata, nativeTitle, queryUser } from "./ts/utils";
    import {
        completedList,
        distance,
        endYear,
        scoreThreshold,
        selected_anime,
        startYear,
        username,
    } from "./store";
    import _ from "lodash";
    import TextInput from "./TextInput.svelte";
    import SliderFilter from "./SliderFilter.svelte";
    import { FullNode, Node } from "./ts/node";
	import Edges from "../src/data-collection/data/edges.json";
	import Layout_ from "../src/data-collection/data/layout.json";
import { ANIME_DATA } from "./ts/types";

    function getOptionLabel(option) {
        if (!option) return "";
        if (!option.englishTitle) return option.title;
        if (option.title === option.englishTitle) return option.title;
        if (nativeTitle(option) === option.englishTitle) {
            return `${option.englishTitle} (${option.title})`;
        } else {
            return `${option.title} (${option.englishTitle})`;
        }
    }

    let options = _.values(Metadata) as ANIME_DATA[];

    function onInit(nodes: FullNode[], node_map: { [id: number]: FullNode }) {
        function updateBrightness(
            node: FullNode,
            distance: number,
            scoreThreshold: number,
            startYear: number,
            endYear: number
        ) {
            const metadata = node.metadata as ANIME_DATA;
            const passingScore = metadata.score >= scoreThreshold;
            const yearInRange =
                metadata.year <= endYear &&
                metadata.year >= startYear;
            const inRecs = node.recommendation_rank <= distance;

            if (passingScore && yearInRange && inRecs) {
                node.brightness = 1;
            } else {
                node.brightness = 0.5;
            }
        }

        function updateAllBrightness(nodes: FullNode[]) {
            nodes.forEach((node) => {
                updateBrightness(
                    node,
                    $distance,
                    $scoreThreshold,
                    $startYear,
                    $endYear
                );
            });
        }

        distance.subscribe(() => updateAllBrightness(nodes));
        scoreThreshold.subscribe(() => updateAllBrightness(nodes));
        startYear.subscribe(() => updateAllBrightness(nodes));
        endYear.subscribe(() => updateAllBrightness(nodes));

        completedList.subscribe((list) => {
            const startNodes =
                list?.length > 0
                    ? list.map((id) => node_map[id]).filter((node) => node)
                    : nodes;
            Node.bfs(startNodes, nodes);
            updateAllBrightness(nodes);
        });
    }
</script>

<Canvas {onInit} {selected_anime} 
   Metadata_={Metadata}
    Edges={Edges.Edges}
    {Layout_}
/>

<Sidebar>
    <SidebarHeader
        slot="top-header"
        githubURL="https://github.com/Nithin1729S/AniClusters"
    >
        <LangButton />
    </SidebarHeader>
    <Searchbar slot="searchbar" {selected_anime} {options} {getOptionLabel} />
    

    <AnimeView slot="metadata-view" />
</Sidebar>

<style lang="scss">
</style>
