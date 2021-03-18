"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  putFavsOnPage();
}

function getHtml(story, type) {
  if (type === "reg") {
    console.log("reg")
    return `<li id="${story.storyId}">
        <span class="hidden star"><i class="far fa-star ${story.storyId}"></i></span>`
  } else if (type === "fav") {
    console.log("fav");
    return `<li class="${story.storyId}">
        <span class="star"><i class="far fa-star ${story.storyId}"></i></span>`
  } else if (type === "own") {
    console.log("own")
    return `<li class="${story.storyId}">
        <span>
          <i class="delete fas fa-trash-alt"></i>
        </span>`
  }
}

/** 
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, type) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const typeOf = getHtml(story, type)
  console.log(typeOf);

   const html = $(`
      ${typeOf}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `)
  return html;
}

//shows stars
function showStar() {
  if (currentUser) {
    $(".star").show();
  }
}

//toggles between line and solid star
function toggleStar(i) {
  console.debug(i);
  $(i).toggleClass("far fas");
}

//adds/removes story from favorites list and html
async function toggleFav(tar, id) {
  console.log(id);
  const currStory = await axios.get(`${BASE_URL}/stories/${id}`);
  const fav = currStory.data.story;
  console.log(fav);
  if ($(tar).hasClass('far')) {
    $emptyFavMsg.hide();
    currentUser.addFav(fav);
    await currentUser.addOrRemoveFav(id, 'POST');
  } else {
    toggleStar(tar);
    currentUser.removeFav(fav);
    await currentUser.addOrRemoveFav(id, 'DELETE');
    putFavsOnPage();
  }
}

$allStoriesList.on("click", ".star", function (e) {
  toggleFav(e.target, e.target.parentElement.parentElement.id);
});

$favStoriesList.on("click", ".star", function (e) {
  const id = e.target.parentElement.parentElement.classList.value
  toggleFav(e.target, id)
});

$ownStoriesList.on("click", ".delete", function (e) {
  const id = e.target.parentElement.parentElement.classList.value;
  $(`#${id}`).remove();
  currentUser.removeStory(id);
  putOwnOnPage();
})

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, "reg");
    $allStoriesList.append($story);
  }
  if(currentUser){
    putFavsOnPage();
    putOwnOnPage()
  }
  $allStoriesList.show();
}

function putFavsOnPage() {
  console.debug('putFavOnPage')
  if (currentUser) {
    $favStoriesList.empty();
    for (let story of storyList.stories) {
      addFavorite(story);
    }
    showStar();
  }
}

function putOwnOnPage() {
  $ownStoriesList.empty();
  if (currentUser.ownStories.length === 0) {
    $emptyOwnMsg.show()
  }
  for (let story of currentUser.ownStories) {
    addOwn(story);
  }
}

//loops through the favorites list and generates html for them
function addFavorite(story) {
  console.debug('addFavorite');
  for (let fav of currentUser.favorites) {
    if (fav.storyId === story.storyId) {
      $emptyFavMsg.hide();
      const favStory = generateStoryMarkup(story, "fav");
      $favStoriesList.append(favStory);
      const I = $(`i.${story.storyId}`)
      for (let x = 0; x < I.length; x++){
        I[x].classList.remove("far");
        I[x].classList.add("fas");
      }
    }
  }
}

//generates html for users story
function addOwn(story) {
  $emptyOwnMsg.hide();
  const newStory = new Story(story);
  const htmlStory = generateStoryMarkup(newStory, "own");
  $ownStoriesList.append(htmlStory);
}

$storyBtn.on('click', function (e) {
  e.preventDefault();
  submitStory();
})

//allows user to add a story
async function submitStory() {
  const author = $('#author-input').val();
  const title = $('#title-input').val();
  const url = $('#url-input').val();
  const username = currentUser.username

  const newStory = { title, author, url, username }
  const story = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(story, "reg");
  $allStoriesList.prepend($story);

  //$storyForm.hide();
  //putStoriesOnPage();
  //getAndShowStoriesOnStart();
  hidePageComponents();
  putStoriesOnPage();
}
