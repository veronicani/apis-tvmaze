"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");
const BASE_URL = "http://api.tvmaze.com/";
const NO_SHOW_IMG = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  //http://api.tvmaze.com/search/shows?q=[searchquery] << format to take input from user
  //fetch the show, passing in url, make sure to reformat
  const searchParams = new URLSearchParams({q: searchTerm});

  let response = await fetch(`${BASE_URL}/search/shows?${searchParams}`,
    {method: "GET"}
  );
  //should return array of objects [{id: , name: , summary: , image: }];

  let searchData = await response.json();

  /**TODO: How to handle other properties that don't have any inputs
   * Can make object definition within map idiom by using destructuring (see
   * commented out code starting this)
  */

  const filteredShows =   searchData.map((searchResult) => {
    const filteredShow = {};
    filteredShow.id = searchResult.show.id;
    filteredShow.name = searchResult.show.name;
    filteredShow.summary = searchResult.show.summary;
    if(searchResult.show.image === null) {
      filteredShow.image = NO_SHOW_IMG;
    } else {
      filteredShow.image = searchResult.show.image.medium;
    }
    return filteredShow;

    // Can retain the the order key/value pairs are added.
    // const filteredShow = new Map();
    // filteredShow.set("id", `${show.show.id}`);
    // filteredShow.set("name", `${show.show.name}`);
    // filteredShow.set("summary", `${show.show.summary}`);
    // filteredShow.set("image", `${show.show.image}`);
    // return filteredShow;
  });

  // Using destructuring
  // const filteredShowsData = searchData.map((searchResult) => {
  //   const {id, name, summary, image} = searchResult.show;
  //   return {id, name, summary, image};
  // })

  return filteredShows;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(showId) {
  // http://api.tvmaze.com/shows/[showid]/episodes << GET request
  //test 55110
  //http://api.tvmaze.com/shows/55110/episodes
  //fetch the show with the corres. id
  console.log('showId: ', showId);
  let response = await fetch(`${BASE_URL}shows/${showId}/episodes`, {method: "GET"});
  let searchData = await response.json();
  //should return array of objects [{id: , name: , summary: , image: }];
  const filteredEpisodes = searchData.map((searchResult) => {
    let {id, name, season, number} = searchResult;
    //turn season and number into string
    number = number.toString();
    season = season.toString();
    return {id, name, season, number};
  });

  console.log('filteredEpisodes: ', filteredEpisodes);
  return filteredEpisodes;
 }


/** Provided an array of episodes info, populate into the #episodesList part of the DOM. 
 * The episode list is a <ul> -- this is already in HTML
 * Each episode is an <li>, e.g. '<li>Pilot (season 1, number 1)</li>'
 * Create individual episodes, and append each to the episode list.
 * Reveal the #episodesArea section
*/

function displayEpisodes(episodes) { 
  console.log('episodes: ', episodes);
  //iterate over the array of episodes info
  for (let episode of episodes) {
    //create a <li>,
    const {name, season, number} = episode;
    const $episode = $("<li>");
    $episode.text(`${name} (season ${season}, number ${number})`).appendTo($episodesList);
    //inner text - `${episode}(season ${season}, number ${number})`
    //append it to the episode list
    console.log($episode);
  }
  //reveal the episodes area
  $episodesArea.show();
}

// add other functions that will be useful / match our structure & design
