// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Changes style to be easier to read for individuals with visual impairments
 * (i.e. larger text, sans serif font, green link color)
 */
function changeSettings() {
    document.body.style.fontSize = "xx-large";
    document.body.style.fontFamily = "Comic Sans MS,cursive,sans-serif";
    var links = document.links;
    for (var i = 0; i <links.length; i++) {
        links[i].style.color = "green";
    }
}

/**
 * Fetches comment from the server and adds it to the DOM.
 */
function getComment() {
  console.log('Fetching comment.');
  const responsePromise = fetch('/data');
  responsePromise.then(handleResponse);
}

/**
 * Handles response by converting it to text and passing the result to
 * addCommentToDom().
 */
function handleResponse(response) {
  console.log('Handling the response.');
  const textPromise = response.text();
  textPromise.then(addCommentToDom);
}

/** Adds comment to the DOM. */
function addCommentToDom(comment) {
  console.log('Adding comment to dom: ' + comment);
  const commentContainer = document.getElementById('comment-container');
  commentContainer.innerText = comment;
}

/** Adds all comments to list */
function getAllComments() {
  // Clear previous list of comments.
  while(commentList.firstChild) {
    commentList.removeChild(commentList.firstChild);
  }

  // Load in specified amount of new comments.
  const maxComments = document.getElementById("max-comments").value;
  const order = document.getElementById("order").value;
  fetch('/data?max-comments=' + maxComments + "&order=" + order).then(response => response.json()).then((data) => {
    console.log("getAllComments()");
    const commentList = document.getElementById('commentList');
    data.forEach((comment) => {
      commentList.appendChild(createListElement(comment))
    });
  });
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  console.log("createListElement(" + text + ")");
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

function createMap() {
  console.log("Beginning of createMap()");
  const map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: 37.422, lng: -122.084}, zoom: 16});
  console.log("End of createMap()");
}
