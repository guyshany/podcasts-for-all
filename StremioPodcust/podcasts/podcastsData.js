const logger = require("../../useful/logger");
const constants = require("../../useful/const");

function getBestPodcasts(page, genreId, region) {

    logger.trace(constants.LOG_MESSAGES.START_GET_BEST_PODCASTS);

    // For genre filter
    let genre = constants.API_CONSTANTS.DEFAULT_GENRE;
    if (genreId) genre = genreId;

    let regionFilter = constants.API_CONSTANTS.DEFAULT_REGION;
    if (region) regionFilter = region;

    return (constants.API_INSTANCE.get(constants.PODCASTS_DATA_API_ROUTES.BEST_PODCASTS, {
            params: {
                page: page,
                genre_id: genre,
                region: regionFilter,
                safe_mode: constants.API_CONSTANTS.EXCLUDE_EXCPLICIT.YES
            }
        })
        .then(function (response) {

            logger.debug(constants.LOG_MESSAGES.SUCCESS_GET_BEST_PODCASTS + response.data.podcasts.length);
            return (response.data.podcasts);
        })
        .catch(function (error) {

            logger.debug(constants.LOG_MESSAGES.ERROR_GET_BEST_PODCASTS + error);
        }));
}

function getBestPodcastsWithEpisodes(page, genreId, region) {

    let podcastsWithEpisodes = [];
    let podcastsByIdPromises = [];
    let counterPomisesByIdDone = 0;
    let numberOfPodcasts;

    return (
        getBestPodcasts(page, genreId, region).then(function (podcasts) {

            if (podcasts)numberOfPodcasts = podcasts.length;
            else podcasts = [];
            
            podcasts.forEach(podcast => {

                getPodcastById(podcast.id).then(function (podcastWithEpisodes) {

                    podcastsWithEpisodes.push(podcastWithEpisodes);
                    counterPomisesByIdDone++;
                });

            });
        }).then(function () {

            var podcastsWithEpisodesPromise = new Promise(function (resolve, reject) {

                let intervalA = setInterval(function () {

                    // Checks if all promises of getting podcast by id as done
                    if (counterPomisesByIdDone == numberOfPodcasts) {

                        logger.info(constants.LOG_MESSAGES.END_HANDLE_WITH_PROMISES + counterPomisesByIdDone);

                        clearInterval(intervalA);
                        resolve(podcastsWithEpisodes)
                    } else {

                        logger.trace(constants.LOG_MESSAGES.ON_GOING_HANDLE_WITH_PROMISES + (numberOfPodcasts - counterPomisesByIdDone));
                    }
                }, 500);
            });
            // Returns a promise that will resolve when all the requests to get data about podcasts by id will be done
            return (podcastsWithEpisodesPromise)
        }));
}

function searchPodcasts(searchTerm, genreIds, offsetForPagination) {

    logger.trace(constants.LOG_MESSAGES.START_SEARCH_PODCASTS + searchTerm);

    // For offset for pagination filter
    let offset = constants.API_CONSTANTS.DEFAULT_OFFSET;
    if (offsetForPagination) offset = offsetForPagination;

    return (constants.API_INSTANCE.get(constants.PODCASTS_DATA_API_ROUTES.SEARCH, {
            params: {
                q: searchTerm,
                sort_by_date: constants.API_CONSTANTS.SORT.BY_RELEVANCE,
                type: constants.API_CONSTANTS.TYPES.PODCAST,
                offset: offset,
                genre_Ids: genreIds,
                only_in: [constants.API_CONSTANTS.ONLY_IN_FIELDS.TITLE, constants.API_CONSTANTS.ONLY_IN_FIELDS.DESCRIPTION],
                safe_mode: constants.API_CONSTANTS.EXCLUDE_EXCPLICIT.YES
            }
        })
        .then(function (response) {

            logger.debug(constants.LOG_MESSAGES.SUCCESS_SEARCH_PODCASTS + response.data.results.length);

            return (response.data.results);
        })
        .catch(function (error) {

            logger.debug(constants.LOG_MESSAGES.ERROR_SEARCH_PODCASTS + error);
        }));
}

function searchPodcastsWithEpisodes(searchTerm, genreIds, offsetForPagination) {

    let podcastsWithEpisodes = [];
    let podcastsByIdPromises = [];
    let counterPomisesByIdDone = 0;
    let numberOfPodcasts;

    return (
        searchPodcasts(searchTerm, genreIds, offsetForPagination).then(function (podcasts) {

            numberOfPodcasts = podcasts.length;

            podcasts.forEach(podcast => {

                getPodcastById(podcast.id).then(function (podcastWithEpisodes) {

                    podcastsWithEpisodes.push(podcastWithEpisodes);
                    counterPomisesByIdDone++;
                });

            });
        }).then(function () {

            var podcastsWithEpisodesPromise = new Promise(function (resolve, reject) {

                let intervalA = setInterval(function () {

                    // Checks if all promises of getting podcast by id as done
                    if (counterPomisesByIdDone == numberOfPodcasts) {

                        logger.info(constants.LOG_MESSAGES.END_HANDLE_WITH_PROMISES + counterPomisesByIdDone);

                        clearInterval(intervalA);
                        resolve(podcastsWithEpisodes)
                    } else {

                        logger.trace(constants.LOG_MESSAGES.ON_GOING_HANDLE_WITH_PROMISES + (numberOfPodcasts - counterPomisesByIdDone));
                    }
                }, 500);
            });
            // Returns a promise that will resolve when all the requests to get data about podcasts by id will be done
            return (podcastsWithEpisodesPromise)
        }));
}

function getPodcastById(id) {

    logger.trace(constants.LOG_MESSAGES.START_GET_PODCAST_BY_ID + id);

    // For offset for pagination filter
    return (constants.API_INSTANCE.get(constants.PODCASTS_DATA_API_ROUTES.PODCAST_BY_ID + id, {
            params: {
                //next_episode_pub_date: "",
            }
        })
        .then(function (response) {

            logger.debug(constants.LOG_MESSAGES.SUCCESS_GET_PODCAST_BY_ID + response.data.id);

            return (response.data);
        })
        .catch(function (error) {

            logger.debug(constants.LOG_MESSAGES.ERROR_GET_PODCAST_BY_ID + error);
        }));
}

function getEpisodeById(id) {

    logger.trace(constants.LOG_MESSAGES.START_GET_EPISODE_BY_ID + id);

    // For offset for pagination filter
    return (constants.API_INSTANCE.get(constants.PODCASTS_DATA_API_ROUTES.EPISODE_BY_ID + id)
        .then(function (response) {

            logger.debug(constants.LOG_MESSAGES.SUCCESS_GET_EPISODE_BY_ID + response.data.id);

            return (response.data);
        })
        .catch(function (error) {

            logger.debug(constants.LOG_MESSAGES.ERROR_GET_EPISODE_BY_ID + error);
        }));
}

module.exports = {
    getBestPodcastsWithEpisodes,
    searchPodcastsWithEpisodes,
    getPodcastById,
    getEpisodeById
}