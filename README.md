# AniClusters

AniClusters is a web application designed to visualize relationships between anime on [MyAnimeList](https://myanimelist.net/) and [AniList](https://anilist.co/home) using user recommendations.

<!-- Overview image -->

## Demo Video


https://github.com/Nithin1729S/AniClusters/assets/78496667/aafa339f-d42f-4db5-92de-21ab4c0402f8



[Watch the demo on youtube](https://myanimelist.net/)
## Description
AniClusters visualizes anime relationships using data from [MyAnimeList](https://myanimelist.net/) and [AniList](https://anilist.co/home). User recommendations are used to create edges between nodes representing different anime.


#### Clustering
The anime graph is clustered using multi-level modularity clustering. Some clusters are merged to create a more straightforward visualization.

#### Layout
The layout of the map is generated through a [particle force simulation](https://github.com/d3/d3-force). Initially, each node is represented by a single particle. The simulation runs for several iterations, during which particles split into new particles for each sub-cluster. Forces are applied to attract related clusters, resulting in an aesthetically pleasing layout.

### Building
AniClusters consists of a backend Node.js app for data collection and clustering, and a Svelte frontend client. The frontend relies on outputs from the backend.

#### Building the backend

1. Open the `/data-collection` directory and run `npm ci` to install all dependencies.
2. Python3 is used for clustering. Install `networkx` and `cdlib` with `pip install -r requirements.txt`.
3. Run `npm run reset` to build and run the whole data pipeline. This will pull all data from MAL/Anilist and create various txt and json files for the frontend. Use `npm run layout` to skip the data collection step.

#### Building the frontend

1. Open the `/svelte` directory and run `npm ci` to install all dependencies.
2. Run `npm run dev` to start a localhost server with live reloading. http://localhost:8080 will show a live view of the layout.

## Acknowledgements

#### Clustering

- https://cdlib.readthedocs.io/en/latest/

#### Layout

- [d3-force](https://github.com/d3/d3-force)
- [d3-force-reuse](https://github.com/twosixlabs/d3-force-reuse)

#### Frontend

- [PIXI.js](https://www.pixijs.com/)
- [PIXI Viewport](https://github.com/davidfig/pixi-viewport)
- [Svelte](https://svelte.dev/)

#### Data

- [MyAnimeList API](https://myanimelist.net/apiconfig/references/api/v2)
- [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/)
