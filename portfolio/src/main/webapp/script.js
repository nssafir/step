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

class PlaceBuilder{
  constructor(name) {
    this.name = name;
    return this;
  }
  withLatitude(latitude) {
    this.latitude = latitude;
    return this;
  }
  withLongitude(longitude) {
    this.longitude = longitude;
    return this;
  }
  withYear(year) {
    this.year = year;
    return this;
  }
  withMessage(message) {
    this.message = message;
    return this;
  }
  build() {
    return new Place(this.name, this.latitude, this.longitude, this.year, this.message);
  }
}



/** Places I have lived. */
const placesLived = [
  new PlaceBuilder("Evanston").withLatitude(42.0451).withLongitude(-86.6877).withYear('2000-2002')
    .withMessage('I was born in outside Chicago at Northwestern Medical Center.').build(),
  new PlaceBuilder("Overland Park").withLatitude(38.9822).withLongitude(-94.6708).withYear('2002-2017')
    .withMessage('I grew up in the Kansas City suburbs, first in Lenexa and then Overland Park. I attended Blue Valley North high school for three years.').build(),
  new PlaceBuilder("Wassenaar").withLatitude(52.1429).withLongitude(4.4012).withYear('2017-2018')
    .withMessage('I moved to the Netherlands before my senior year because my father switched jobs. I graduated from the American School of the Hague.').build(),
  new PlaceBuilder("Athens").withLatitude(33.9519).withLongitude(-83.3576).withYear('2018-Present')
    .withMessage('I now live in Athens, Georgia. I am going into my junior year at UGA.').build(),
  new PlaceBuilder("Oxford").withLatitude(51.7520).withLongitude(-1.2577).withYear('May-June 2019')
    .withMessage('For the beginning of summer after my freshman year, I studied Computing Ethics at Oxford through the Foundation Fellowship\'s Maymester Program').build()
]

/** Places I have visited. */
const placesVisited = [
  // Domestic
  new PlaceBuilder('New York').withLatitude(40.7128).withLongitude(-74.0060).withYear(2019),
  new PlaceBuilder('Washington D.C.').withLatitude(38.9072).withLongitude(-77.0369).withYear(2019),
  new PlaceBuilder('San Francisco').withLatitude(37.7749).withLongitude(-122.4194).withYear(2014),
  new PlaceBuilder('Los Angeles').withLatitude(34.0522).withLongitude(-118.2437).withYear(2013),
  new PlaceBuilder('Bonita Springs').withLatitude(26.3398).withLongitude(-81.7787).withYear(2020),
  new PlaceBuilder('San Juan').withLatitude(18.4655).withLongitude(-66.1057).withYear(2020),
  new PlaceBuilder('Vieques').withLatitude(18.1263).withLongitude(-65.4401).withYear(2020),
  new PlaceBuilder('Niagra Falls').withLatitude(43.0962).withLongitude(-79.0377).withYear(2008),
  new PlaceBuilder('St. Louis').withLatitude(38.6270).withLongitude(-90.1994).withYear(2012),
  new PlaceBuilder('Omaha').withLatitude(41.2565).withLongitude(-95.9345).withYear(2012),
  new PlaceBuilder('Sioux City').withLatitude(42.4963).withLongitude(-96.4049).withYear(2012),
  new PlaceBuilder('Des Moines').withLatitude(41.5868).withLongitude(-93.6250).withYear(2012),
  new PlaceBuilder('Lincoln').withLatitude(40.8136).withLongitude(-96.7026).withYear(2012),
  new PlaceBuilder('Wichita').withLatitude(37.6872).withLongitude(-97.3301).withYear(2012),
  new PlaceBuilder('Miami').withLatitude(25.7617).withLongitude(-80.1918).withYear(2012),
  new PlaceBuilder('Minneapolis').withLatitude(44.9778).withLongitude(93.2650).withYear(2012),
  // International
  new PlaceBuilder('Barcelona').withLatitude(41.3851).withLongitude(2.1734).withYear(2018),
  new PlaceBuilder('Paris').withLatitude(48.8566).withLongitude(2.3522).withYear(2019),
  new PlaceBuilder('Split').withLatitude(43.5081).withLongitude(16.4402).withYear(2019),
  new PlaceBuilder('London').withLatitude(51.5074).withLongitude(0.1278).withYear(2019),
  new PlaceBuilder('Venice').withLatitude(45.4408).withLongitude(12.3155).withYear(2017),
  new PlaceBuilder('Prague').withLatitude(50.0755).withLongitude(14.4378).withYear(2017),
  new PlaceBuilder('Cesky Krumlov').withLatitude(48.8127).withLongitude(14.3175).withYear(2017),
  new PlaceBuilder('Vienna').withLatitude(48.2082).withLongitude(16.3738).withYear(2017),
  new PlaceBuilder('Salzburg').withLatitude(47.8095).withLongitude(13.0550).withYear(2017),
  new PlaceBuilder('Jerusalem').withLatitude(31.7683).withLongitude(35.2137).withYear(2014),
  new PlaceBuilder('Tel Aviv').withLatitude(32.0853).withLongitude(34.7818).withYear(2014),
  new PlaceBuilder('Ayia Napa').withLatitude(34.9923).withLongitude(34.0140).withYear(2018)
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
  let titleString = ': visited in ';
  if (addWindow) {
    titleString = ': lived from ';
  }
  for (var i = 0; i < placeList.length; i++) {
    let place = placeList[i];
    let marker = new google.maps.Marker({
      position: {lat: place.latitude, lng: place.longitude},
      map: map,
      title: (place.name + titleString + place.year),
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
