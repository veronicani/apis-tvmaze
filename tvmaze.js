"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = 'http://api.tvmaze.com/';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchInput) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  //http://api.tvmaze.com/search/shows?q=[searchquery] << format to take input from user
  //fetch the show, passing in url, make sure to reformat
  const searchParams = new URLSearchParams({q: searchInput});

  let response = await fetch(`${BASE_URL}/search/shows?${searchParams}`,
    {method: "GET"}
  );
  //should return array of objects [{id: , name: , summary: , image: }];

  let searchData = await response.json();

  const filteredShows =   searchData.map((show) => {
    const filteredShow = {};
    filteredShow.id = show.show.id;
    filteredShow.name = show.show.name;
    filteredShow.summary = show.show.summary;
    if(show.show.image === null) {
      filteredShow.image = "https://tinyurl.com/tv-missing";
    } else {
      filteredShow.image = show.show.image.medium;
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

// async function getEpisodesOfShow(id) { }
// http://api.tvmaze.com/shows/[showid]/episodes << GET request


/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
