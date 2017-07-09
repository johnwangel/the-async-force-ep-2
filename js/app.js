/*jshint esversion: 6 */
const reqButton = document.getElementById('requestResourceButton');
const selectorBox = document.getElementById('resourceType');
const bodyDiv = document.getElementById('contentContainer');
const inputBox = document.getElementById('resourceId');

reqButton.addEventListener('click', clickedButton);

function clickedButton(e){
  clearResults();
  let num = parseInt(inputBox.value);
  let pageNo = (function() {
    if (num > 9) {
      return Math.floor(num/10);
    } else {
      return 1;
    }
  })();
  console.log('page ', pageNo);
  switch (selectorBox.value) {
    case 'people':
      let peopleReq = makeXHRReq('GET', getPerson, `http://swapi.co/api/people/?page=${pageNo}`);
      break;
    case 'planets':
      let planetReq = makeXHRReq('GET', getPlanets, `http://swapi.co/api/planets?page=${pageNo}`);
      break;
    case 'starships':
      let starshipReq = makeXHRReq('GET', getShip, `http://swapi.co/api/starships?page=${pageNo}`);
      break;
    default:
      return;
  }
}

function makeXHRReq( method, listener, url ) {
  let req = new XMLHttpRequest();
  req.addEventListener("load", listener);
  req.open(method, url);
  req.send();
  return req;
}

function getPerson() {

  let people = JSON.parse(this.response);
  let num = parseInt(inputBox.value);
  if( this.status !== 200 || num > people.count + 1 ){
    makeError('Invalid ID. Please try a lower number.');
    return;
  }

  let location = (function() {
    if (num > 9) { return (Math.floor(num) - (Math.floor(num/10) * 10)); }
      else { return num; }
    })();
  let myPerson = people.results[location];
  let title = document.createElement('h2');
  title.innerHTML = "Name: " + myPerson.name;
  let gender = document.createElement('p');
  gender.innerHTML = "Gender: " + myPerson.gender;
  let species = document.createElement('p');
  makeXHRReq('GET', getSpecies, myPerson.species[0]);

  bodyDiv.appendChild(title);
  bodyDiv.appendChild(gender);
  bodyDiv.appendChild(species);

  function getSpecies() {
    obj = JSON.parse(this.response);
    species.innerHTML =  "Species: " + obj.name;
  }
  clearInput();
}

function getPlanets() {

  let planets = JSON.parse(this.response);
  let num = parseInt(inputBox.value);
  if( this.status !== 200 || num > planets.count + 1 ){
    makeError('Invalid ID. Please try a lower number.');
    return;
  }

  let location = (function() {
    if (num > 9) { return (Math.floor(num) - (Math.floor(num/10) * 10)); }
      else { return num; }
    })();

  let myPlanet = planets.results[location];
  let name = document.createElement('h2');
  name.innerHTML = "Name: " + myPlanet.name;
  let terrain = document.createElement('p');
  terrain.innerHTML = "Terrain: " + myPlanet.terrain;
  let population = document.createElement('p');
  population.innerHTML = "Population: " + myPlanet.population;

  let filmUL = document.createElement('ul');
  let filmArray = myPlanet.films;
  for (var i = 0; i < filmArray.length; i++) {
    makeXHRReq('GET', getFilms, filmArray[i]);
  }

  bodyDiv.appendChild(name);
  bodyDiv.appendChild(terrain);
  bodyDiv.appendChild(population);
  bodyDiv.appendChild(filmUL);

  function getFilms() {
    obj = JSON.parse(this.response);
    let film = document.createElement('li');
    film.innerHTML =  obj.title;
    filmUL.appendChild(film);
  }
  clearInput();
}

function getShip() {
  let ships = JSON.parse(this.response);
  let num = parseInt(inputBox.value);
  if( this.status !== 200 || num > ships.count + 1 ){
    makeError('Invalid ID. Please try a lower number.');
    return;
  }

  let location = (function() {
    if (num > 9) { return (Math.floor(num) - (Math.floor(num/10) * 10)); }
      else { return num; }
    })();

  let myShip = ships.results[location];
  let name = document.createElement('h2');
  name.innerHTML = "Name: " + myShip.name;
  let manu = document.createElement('p');
  manu.innerHTML = "Manufacturer: " + myShip.manufacturer;
  let starshipClass = document.createElement('p');
  starshipClass.innerHTML = "Starship Class: " + myShip.starship_class;

  let filmUL = document.createElement('ul');
  let filmArray = myShip.films;
  for (var i = 0; i < filmArray.length; i++) {
    makeXHRReq('GET', getFilms, filmArray[i]);
  }

  bodyDiv.appendChild(name);
  bodyDiv.appendChild(manu);
  bodyDiv.appendChild(starshipClass);
  bodyDiv.appendChild(filmUL);

  function getFilms() {
    obj = JSON.parse(this.response);
    let film = document.createElement('li');
    film.innerHTML =  obj.title;
    filmUL.appendChild(film);
  }
  clearInput();


}

function makeError(message) {
  let myError = document.createElement('p');
  myError.innerHTML = message;
  bodyDiv.appendChild(myError);
}

function clearInput() {
  inputBox.innerHTML = '';
}

function clearResults() {
  bodyDiv.innerHTML = '';
}

