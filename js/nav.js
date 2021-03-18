"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  //putFavsOnPage();
  //getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories); 

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFav.show();
  $navOwn.show();
  $('#favorites').hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** Allows the user to submit new stories */
$navSubmit.on('click', function (e) {
  hidePageComponents();
  console.log(e);
  $storyForm.show();
})

$navFav.on("click", function () {
  hidePageComponents();
  putFavsOnPage();
  $("#favorites").show();
})

$navOwn.on("click", function (e) {
  hidePageComponents();
  putOwnOnPage();
  $("#own-stories").show()
  if (currentUser.favorites.length === 0) {
    $emptyFavMsg.show();
  }
})