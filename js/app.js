/*jshint esversion: 6 */
const reqButton = document.getElementById('requestResourceButton');
const selectorBox = document.getElementById('resourceType');
const bodyDiv = document.getElementById('contentContainer');
const inputBox = document.getElementById('resourceId');

reqButton.addEventListener('click', clickedButton);

let myMethod = '';

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
  switch (selectorBox.value) {
    case 'people':
      let peopleReq = fetchData('person', `http://swapi.co/api/people/?page=${pageNo}`);
      break;
    case 'planets':
      let planetReq = fetchData('planet', `http://swapi.co/api/planets?page=${pageNo}`);
      break;
    case 'starships':
      let starshipReq = fetchData('ship', `http://swapi.co/api/starships?page=${pageNo}`);
      break;
    default:
      return;
  }
}

function fetchData(method, url){
  myMethod = method;
  fetch(url)
  .then( response => { return response.json(); })
  .then( data => {
    let num = parseInt(inputBox.value);
    let location = (function() {
      if (num > 9) { return (Math.floor(num) - (Math.floor(num/10) * 10)); }
          else { return num; }
    })();

    let row1 = document.createElement('h2');
    let row2 = document.createElement('p');
    let row3 = document.createElement('p');
    let filmUL;
    let filmArray;

    let item = data.results[location];
    let row1ttl, row2ttl, row3ttl, row1val, row2val, row3val;
    switch (myMethod) {
      case "person":
          row1ttl = 'Name: ';
          row2ttl = 'Gender: ';
          row3ttl = 'Species: ';
          row1val = item.name;
          row2val = item.gender;
          fetch(item.species[0])
          .then(response => { return response.json(); })
          .then(data => {
            row3val = data.name;
            row1.innerHTML = row1ttl + row1val;
            row2.innerHTML = row2ttl + row2val;
            row3.innerHTML = row3ttl + row3val;
            bodyDiv.appendChild(row1);
            bodyDiv.appendChild(row2);
            bodyDiv.appendChild(row3);
          });
        break;
      case "planet":
          row1.innerHTML = `Name: ${item.name}`;
          row2.innerHTML = `Terrain: ${item.terrain}`;
          row3.innerHTML = `Population: ${item.population}`;
          bodyDiv.appendChild(row1);
          bodyDiv.appendChild(row2);
          bodyDiv.appendChild(row3);
          createList(item.films);
        break;
      case "ship":
          row1.innerHTML = `Name: ${item.name}`;
          row2.innerHTML = `Manufacturer: ${item.manufacturer}`;
          row3.innerHTML = `Starship Class: ${item.starship_class}`;
          bodyDiv.appendChild(row1);
          bodyDiv.appendChild(row2);
          bodyDiv.appendChild(row3);
          createList(item.films);
        break;
      default:
        return;
    }
    clearInput();
  });
}

function createList( list ){
  for (var i = 0; i < list.length; i++) {
    fetch(list[i])
    .then(response => { return response.json(); })
    .then(obj => {
      ul = document.createElement('ul');
      let li = document.createElement('li');
      li.innerHTML =  obj.title;
      ul.appendChild(li);
      bodyDiv.appendChild(ul);
    });
  }
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