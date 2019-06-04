// External dependencies
const {
    addonBuilder
} = require("stremio-addon-sdk");

// Dependencie which read from the env variables
require('dotenv').config();

// Internal dependencies
const constants = require('./common/const');
const logger = require("./common/logger.js");
const convertors = require("./podcasts/convertors");
const podcastsData = require("./podcasts/podcastsDataFetcher");
const genresData = require("./podcasts/genresDataFetcher");
const countriesData = require("./podcasts/countriesDataFetcher");
const manifest = require('./manifest');
const convertorsItunes = require("./podcasts/convertorsItunes");
const podcastsApiItunes = require("./common/podcastsApiItunes");
const searchHelper = require("./resources/searchHelper");

logger.info(constants.LOG_MESSAGES.START_ADDON + " Version: " + process.env.VERSION);

const builder = new addonBuilder(manifest);

// Addon handlers
// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
builder.defineCatalogHandler(async ({
                                        type,
                                        id,
                                        extra
                                    }) => {


    if (process.env.USE_ITUNES === "true") {
        let Serieses = [];

        if (extra.genre && id === constants.CATALOGS.BY_GENRE.ID) {
            logger.info(constants.CATALOGS.BY_GENRE.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_GENRE.NAME, extra.genre);

            const podcasts = await podcastsApiItunes.search(extra.genre);
            Serieses = await convertorsItunes.podcastsToSerieses(podcasts, constants.HANDLERS.CATALOG.toLowerCase());

        } else if (extra.genre && id === constants.CATALOGS.BY_COUNTRY.ID) {
            logger.info(constants.CATALOGS.BY_COUNTRY.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_COUNTRY.NAME, extra.genre);

            const podcasts = await podcastsApiItunes.search(extra.genre);
            Serieses = await convertorsItunes.podcastsToSerieses(podcasts, constants.HANDLERS.CATALOG.toLowerCase());

        } else if (extra.genre && id === constants.CATALOGS.BY_MOOD.ID) {
            logger.info(constants.CATALOGS.BY_MOOD.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_MOOD.NAME, extra.genre);

            const podcasts = await podcastsApiItunes.search(extra.genre);
            Serieses = await convertorsItunes.podcastsToSerieses(podcasts, constants.HANDLERS.CATALOG.toLowerCase());

        } else if (extra.genre && id === constants.CATALOGS.BY_TREND.ID) {
            logger.info(constants.CATALOGS.BY_TREND.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_TREND.NAME, extra.genre);

            const podcasts = await podcastsApiItunes.search(extra.genre);
            Serieses = await convertorsItunes.podcastsToSerieses(podcasts,  constants.HANDLERS.CATALOG.toLowerCase());

        } else if (extra.search) {
            let Serieses = [];
            if (extra.search.toLowerCase().includes(constants.SEARCH_PREFIX)) {

                const fixedSearchTerm = extra.search.split(constants.SEARCH_PREFIX)[1];
                logger.info(constants.LOG_MESSAGES.SEARCH_ON_CATALOG_HANDLER_FOR_PODCAST + fixedSearchTerm, constants.HANDLERS.CATALOG, constants.CATALOGS.SEARCH.NAME, extra.search.toLowerCase(), null, {
                    search: fixedSearchTerm.toLowerCase()
                });

                const podcasts = await podcastsApiItunes.search(fixedSearchTerm);
                Serieses.asArray = await convertorsItunes.podcastsToSerieses(podcasts, constants.HANDLERS.CATALOG.toLowerCase());
            } else {

                logger.info(constants.LOG_MESSAGES.SEARCH_ON_CATALOG_HANDLER + extra.search, constants.HANDLERS.CATALOG, constants.CATALOGS.SEARCH.NAME, extra.search.toLowerCase(), null, {
                    search: extra.search.toLowerCase()
                });

                // Shows instructions if the search format was not used
                Serieses.asArray = searchHelper;
            }

            return {
                metas: Serieses.asArray
            };
        } else {
            const podcasts = await podcastsApiItunes.search("top");
            Serieses = await convertorsItunes.podcastsToSerieses(podcasts,  constants.HANDLERS.CATALOG.toLowerCase());
        }

        return {
            metas: Serieses
        }

    } else {
        logger.info(constants.LOG_MESSAGES.START_CATALOG_HANDLER + "(type: " + type + " & id: " + id + ")", constants.HANDLERS.CATALOG, id);

        let genre = 0;
        let country = constants.API_CONSTANTS.DEFAULT_REGION;

        if (extra.genre && id === constants.CATALOGS.BY_GENRE.ID) {
            logger.info(constants.CATALOGS.BY_GENRE.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_GENRE.NAME, extra.genre);

            genre = extra.genre;
            genre = genresData.findGenreId(genre)
        } else if (extra.genre && id === constants.CATALOGS.BY_COUNTRY.ID) {
            logger.info(constants.CATALOGS.BY_COUNTRY.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_COUNTRY.NAME, extra.genre);

            country = extra.genre;
            country = countriesData.findCountryId(country);
        } else if (extra.genre && id === constants.CATALOGS.FEELING_LUCKY.ID) {
            logger.info(constants.CATALOGS.FEELING_LUCKY.NAME + ": Try his luck", constants.HANDLERS.CATALOG, constants.CATALOGS.FEELING_LUCKY.NAME);

            const podcast = await podcastsData.getFeelingLucky();
            const serieses = await convertors.podcastsToSerieses([convertors.luckyPodcastToPodcast(podcast)]);

            return {
                metas: serieses.asArray
            };
        } else if (extra.genre && id === constants.CATALOGS.BY_MOOD.ID) {
            logger.info(constants.CATALOGS.BY_MOOD.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_MOOD.NAME, extra.genre);

            let Serieses = [];

            const podcasts = await podcastsData.searchPodcasts(extra.genre, null, null, true);
            Serieses = await convertors.podcastsToSerieses(podcasts, constants.PODCAST_TYPE.SEARCH);

            return {
                metas: Serieses.asArray
            };
        } else if (extra.genre && id === constants.CATALOGS.BY_TREND.ID) {
            logger.info(constants.CATALOGS.BY_TREND.NAME + ": " + extra.genre, constants.HANDLERS.CATALOG, constants.CATALOGS.BY_TREND.NAME, extra.genre);

            let Serieses = [];
            const podcasts = await podcastsData.searchPodcasts(extra.genre, null, null, true);
            Serieses = await convertors.podcastsToSerieses(podcasts, constants.PODCAST_TYPE.SEARCH);

            return {
                metas: Serieses.asArray
            };
        }

        // If there is active search using search api instead of best podcasts api
        if (extra.search) {

            let Serieses = [];

            if (extra.search.toLowerCase().includes(constants.SEARCH_PREFIX)) {

                const fixedSearchTerm = extra.search.split(constants.SEARCH_PREFIX)[1];
                logger.info(constants.LOG_MESSAGES.SEARCH_ON_CATALOG_HANDLER_FOR_PODCAST + fixedSearchTerm, constants.HANDLERS.CATALOG, constants.CATALOGS.SEARCH.NAME, extra.search.toLowerCase(), null, {
                    search: fixedSearchTerm.toLowerCase()
                });

                const podcasts = await podcastsData.searchPodcasts(fixedSearchTerm);
                Serieses = await convertors.podcastsToSerieses(podcasts, constants.PODCAST_TYPE.SEARCH);
            } else {

                logger.info(constants.LOG_MESSAGES.SEARCH_ON_CATALOG_HANDLER + extra.search, constants.HANDLERS.CATALOG, constants.CATALOGS.SEARCH.NAME, extra.search.toLowerCase(), null, {
                    search: fixedSearchTerm.toLowerCase()
                });

                // Shows instructions if the search format was not used
                Serieses.asArray = searchHelper;
            }

            return {
                metas: Serieses.asArray
            };
        } else {
            const podcasts = await podcastsData.getBestPodcasts(extra.skip ? extra.skip : 0, genre, country);
            const serieses = await convertors.podcastsToSerieses(podcasts);
            let finalPodcasts = serieses.asArray;
            return {
                metas: finalPodcasts
            };
        }
    }
});

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineMetaHandler.md
builder.defineMetaHandler(async ({
                                     type,
                                     id
                                 }) => {

    logger.info(constants.LOG_MESSAGES.START_META_HANDLER + "(type: " + type + " & id: " + id + ")", constants.HANDLERS.META, constants.API_CONSTANTS.TYPES.PODCAST);
    id = id.replace(constants.ID_PREFIX, "");

    if (process.env.USE_ITUNES === "true") {
        const podcast = await podcastsApiItunes.getPodcastById(id);

        logger.info("Podcast: " + podcast.collectionName + " | " + podcast.country + ": " + constants.HANDLERS.META, constants.API_CONSTANTS.TYPES.PODCAST, null, 1, podcast);

        return {
            meta: await convertorsItunes.podcastToSeries(podcast, constants.HANDLERS.META.toLowerCase()),
            video: convertorsItunes.podcastToSeriesVideo(podcast)
        };
    } else {
        const podcast = await podcastsData.getPodcastById(id);

        logger.info("Podcast: " + podcast.title + " | " + podcast.country + " | " + podcast.language, constants.HANDLERS.META, constants.API_CONSTANTS.TYPES.PODCAST, null, 1, podcast);

        return {
            meta: await convertors.podcastToSeries(podcast),
            video: convertors.podcastToSeriesVideo(podcast)
        };
    }


});


// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
builder.defineStreamHandler(async ({
                                       id,
                                       type
                                   }) => {

    logger.info(constants.LOG_MESSAGES.START_STREAM_HANDLER + "(type: " + type + " & id: " + id + ")", constants.HANDLERS.STREAM, constants.API_CONSTANTS.TYPES.EPISODE, null, 1, {
        id: id
    });

    id = id.replace(constants.ID_PREFIX, "");

    let episode = {};

    if (process.env.USE_ITUNES === "true") {

        logger.info(constants.LOG_MESSAGES.USING_ITUNES_STRAEM_HANDLER);

        // When using itunes the id is itunesEpisodeId|listennotesPodcastId
        let idParts = id.split("|");
        let idParts2 = idParts[0].split("/");
        //const podcast = await podcastsData.getPodcastById(idParts[1]);
        const podcast = await podcastsApiItunes.getPodcastById(idParts[1]);
        const itunesEpisodes = await podcastsApiItunes.getEpisodesByPodcastId(podcast.collectionId);
        const itunesVideos = convertorsItunes.episodesToVideos(itunesEpisodes).asArray;
        episode = podcastsApiItunes.getEpisodeFromVideos(itunesVideos, constants.ID_PREFIX + idParts[0]);
        episode.podcast = podcast;
    } else {

        episode = await podcastsData.getEpisodeById(id);
    }

    return {
        streams: convertors.getStreamsFromEpisode(episode)
    };
});

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
builder.defineSubtitlesHandler(async function (args) {

    logger.info(constants.LOG_MESSAGES.START_SUBTITLE_HANDLER + "(type: " + args.type + " & id: " + args.id + ")", constants.HANDLERS.SUBTITLE, constants.API_CONSTANTS.TYPES.EPISODE, null, 1, {
        id: args.id
    });

    return {
        subtitles: []
    };
});

module.exports = builder.getInterface();