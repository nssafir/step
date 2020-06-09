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

/** Places I have lived. */
var placesLived = [
  ['Evanston', 42.0451, -87.6877, 
    '<h1>Evanston: 2000-2002</h1>'+'<p>I was born in outside Chicago at Northwestern Medical Center.</p>'],
  ['Overland Park', 38.9822, -94.6708, 
    '<h1>Overland Park: 2002-2017</h1>'+'<p>I was born in outside Chicago at Northwestern Medical Center.</p>'],
  ['Wassenaar', 52.1429, 4.4012,
    '<h1>Wassenaar: 2017-2018</h1>'+'<p>I was born in outside Chicago at Northwestern Medical Center.</p>'],
  ['Athens', 33.9519, -83.3576,
    '<h1>Athens: 2018-Present</h1>'+'<p>I was born in outside Chicago at Northwestern Medical Center.</p>'],
  ['Oxford', 51.7520, -1.2577,
    '<h1>Oxford: May-June 2019</h1>'+'<p>I was born in outside Chicago at Northwestern Medical Center.</p>']
];

var placesVisited = [
  // Domestic
  ['New York', 40.7128, -74.0060, 2019],
  ['Washington D.C.', 38.9072, -77.0369, 2019],
  ['San Francisco', 37.7749, -122.4194, 2014],
  ['Los Angeles', 34.0522, -118.2437, 2013],
  ['Bonita Springs', 26.3398, -81.7787, 2020]
  ['San Juan', 18.4655, -66.1057, 2020],
  ['Vieques', 18.1263, -65.4401, 2020],
  ['Niagra Falls', 43.0962, -79.0377, 2008],  //place holder
  ['St. Louis', 38.6270, -90.1994, 2012],  // place holder
  ['Omaha', 41.2565, -95.9345, 2012],  // place holder
  ['Sioux City', 42.4963, -96.4049, 2012],  // place holder
  ['Des Moines', 41.5868, -93.6250, 2012],  // place holder
  ['Lincoln', 40.8136, -96.7026, 2012],  //place holder
  ['Wichita', 37.6872, -97.3301, 2012],  // place holder
  ['Miami', 25.7617, -80.1918, 2012],  // place holder
  // International
  ['Barcelona', 41.3851, 2.1734, 2018], 
  ['Paris', 48.8566, 2.3522, 2019], 
  ['Split', 43.5081, 16.4402, 2019],
  ['London', 51.5074, 0.1278, 2019],
  ['Venice', 45.4408, 12.3155, 2017],
  ['Prague', 50.0755, 14.4378, 2017],
  ['Cesky Krumlov', 48.8127, 14.3175, 2017],
  ['Vienna', 48.2082, 16.3738, 2017],
  ['Salzburhg', 47.8095, 13.0550, 2017],
  ['Jerusalem', 31.7683, 35.2137, 2014],
  ['Tel Aviv', 32.0853, 34.7818, 2014],

]

/** Creates a map and adds it to the page. */
function createMap() {

  // creates map and adds it to page
  const map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: 37.601187, lng: -40.705303}, zoom: 3});
  
  // adds markers to the map
  var livedIcon = {
    url: "/images/livedPin.svg",
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 32)};

  

  for (var i = 0; i < placesLived.length; i++) {
    var place = placesLived[i];
    /*
    var infoWindow = new google.maps.InfoWindow({
      content: place[3]
    });
    */
    var marker = new google.maps.Marker({
      position: {lat: place[1], lng: place[2]},
      map: map,
      title: place[0],
      icon: livedIcon
    });
    attachWindow(marker, place[3]);
    /*
    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
    */
  }
}

function attachWindow(marker, message) {
  console.log("in attach window");
  var infowindow = new google.maps.InfoWindow({
    content: message
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });  
}



