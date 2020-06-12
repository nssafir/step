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

class Place {
  constructor(name, latitude, longitude, year, message = "") {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.year = year;
    this.message = message;
  }
}

/** Places I have lived. */
const placesLived = [
  new Place('Evanston', 42.0451, -87.6877, '2000-2002', 'I was born in outside Chicago at Northwestern Medical Center.'),
  new Place('Overland Park', 38.9822, -94.6708, '2002-2017', 'I grew up in the Kansas City suburbs, first in Lenexa and then Overland Park. I attended Blue Valley North high school for three years.'),
  new Place('Wassenaar', 52.1429, 4.4012, '2017-2018', 'I moved to the Netherlands before my senior year because my father switched jobs. I graduated from the American School of the Hague.'),
  new Place('Athens', 33.9519, -83.3576, '2018-Present', 'I now live in Athens, Georgia. I am going into my junior year at UGA.'),
  new Place('Oxford', 51.7520, -1.2577, 'May-June 2019', 'For the beginning of summer after my freshman year, I studied Computing Ethics at Oxford through the Foundation Fellowship\'s Maymester Program')
]

/** Places I have visited. */
const placesVisited = [
  // Domestic
  new Place('New York', 40.7128, -74.0060, 2019),
  new Place('Washington D.C.', 38.9072, -77.0369, 2019),
  new Place('San Francisco', 37.7749, -122.4194, 2014),
  new Place('Los Angeles', 34.0522, -118.2437, 2013),
  new Place('Bonita Springs', 26.3398, -81.7787, 2020),
  new Place('San Juan', 18.4655, -66.1057, 2020),
  new Place('Vieques', 18.1263, -65.4401, 2020),
  new Place('Niagra Falls', 43.0962, -79.0377, 2008),
  new Place('St. Louis', 38.6270, -90.1994, 2012),
  new Place('Omaha', 41.2565, -95.9345, 2012),
  new Place('Sioux City', 42.4963, -96.4049, 2012),
  new Place('Des Moines', 41.5868, -93.6250, 2012),
  new Place('Lincoln', 40.8136, -96.7026, 2012),
  new Place('Wichita', 37.6872, -97.3301, 2012),
  new Place('Miami', 25.7617, -80.1918, 2012),
  // International
  new Place('Barcelona', 41.3851, 2.1734, 2018),
  new Place('Paris', 48.8566, 2.3522, 2019),
  new Place('Split', 43.5081, 16.4402, 2019),
  new Place('London', 51.5074, 0.1278, 2019),
  new Place('Venice', 45.4408, 12.3155, 2017),
  new Place('Prague', 50.0755, 14.4378, 2017),
  new Place('Cesky Krumlov', 48.8127, 14.3175, 2017),
  new Place('Vienna', 48.2082, 16.3738, 2017),
  new Place('Salzburg', 47.8095, 13.0550, 2017),
  new Place('Jerusalem', 31.7683, 35.2137, 2014),
  new Place('Tel Aviv', 32.0853, 34.7818, 2014),
  new Place('Ayia Napa', 34.9923, 34.0140, 2018)
]

/** Creates a map and adds it to the page. */
function createMap() {
  // Creates map and adds it to page.
  const map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: 37.601187, lng: -40.705303}, zoom: 3});
  
  // Adds lived markers to the map.
  let livedIcon = {
    url: "/images/livedPin.svg",
    scaledSize: new google.maps.Size(30, 48),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 48)};
  addMarkers(map, placesLived, livedIcon, true);

  // Add visited markers to the map.
  let visitedIcon = {
    url: "/images/visitedPin.svg",
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 32)};
  addMarkers(map, placesVisited, visitedIcon, false);
}

/** Adds markers to the map. */
function addMarkers(map, placeList, image, addWindow) {
  for (var i = 0; i < placeList.length; i++) {
    let place = placeList[i];
    let marker = new google.maps.Marker({
      position: {lat: place.latitude, lng: place.longitude},
      map: map,
      title: (place.name + ': lived from ' + place.year),
      icon: image
    });
    if (addWindow) {
      attachWindow(marker, place.message, place.name, place.year);    
    }   
  }  
}

/** Formats and attaches an information window to a marker. */
function attachWindow(marker, message, header, years) {
  display = '<h1>' + header + ': ' + years + '</h1>'
  display += '<p>' + message + '</p>'
  let infowindow = new google.maps.InfoWindow({
    content: display
  });
  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });  
}
