/*jshint esversion: 6 */
const reqButton = document.getElementById('requestResourceButton');
const selectorBox = document.getElementById('resourceType');
const bodyDiv = document.getElementById('contentContainer');
const inputBox = document.getElementById('resourceId');

reqButton.addEventListener('click', clickedButton);

let myMethod = '';
let indexNo = 0;

function clickedButton(e){
  clearResults();
  let pageNo = getIndexNo(parseInt(inputBox.value));
  console.log(pageNo);

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
    let location = indexNo;

    let row1 = document.createElement('h2');
    let row2 = document.createElement('p');
    let row3 = document.createElement('p');

    let item = data.results[location];
    let row1ttl, row2ttl, row3ttl, row1val, row2val, row3val;
    switch (myMethod) {
      case "person":
          row1.innerHTML = `Name: ${item.name}`;
          row2.innerHTML = `Gender: ${item.gender}`;
          bodyDiv.appendChild(row1);
          bodyDiv.appendChild(row2);
          fetch(item.species[0])
          .then(response => { return response.json(); })
          .then(data => {
            row3.innerHTML = `Species: ${data.name}`;
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

function getIndexNo(num){
    if (num > 9) {
      indexNo = Math.floor(num/10);
    } else {
      indexNo = 1;
    }
    return indexNo;
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