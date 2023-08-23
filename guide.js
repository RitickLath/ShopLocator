var map = L.map("map").setView([22.9074872, 79.0730667], 5);

let TileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
tileAttribute =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// add tiles to L object
const tile_layer = L.tileLayer(TileUrl, tileAttribute);
// add tile_layer to map
tile_layer.addTo(map);

// function to add shops to the left side from stores.js
const add_shops = function () {
  const ul = document.querySelector(".lists");
  storeList.forEach((stores) => {
    // creating elements for each outlet
    const li = document.createElement("li");
    const div = document.createElement("div"); // list k andar dalne wala div
    const a = document.createElement("a"); // div k andar dalne wala anchor tag
    a.addEventListener("click", () => {
      flyToshop(stores);
    });

    const p = document.createElement("p"); // div k andar dalne wala paragraph

    div.classList.add("divv"); // link the div we created to div in html named heading
    // creating variable containing data for each element
    const outlet_no = stores.properties.name;
    const address = stores.properties.address;

    a.innerText = outlet_no;
    p.innerText = address;
    a.href = "#";

    div.appendChild(a); // append a that contains the outlet number into div
    div.appendChild(p); // append p that contains address into div
    li.appendChild(div); // append div into list
    ul.appendChild(li); // adding all lists to ul of our html named lists class
  });
};

add_shops(); // calling add shop to add shops on the left side of screen

// add content to popup can be called when bindpopup
function makeContent(shop) {
  return `
    <div>
        <h4>${shop.properties.name}</h4>
        <p>${shop.properties.address}</p>
        <div class="ph-no">
            <a href= "tel:${shop.properties.phone}">${shop.properties.phone}</a>
        </div> `;
}

// add popup to the marker function -> used below in line 60
function onEachFeature(Feature, layer) {
  layer.bindPopup(makeContent(Feature), { closeButton: false });
}

// adding popup to each stores -> read about geoJSON
const shopLayer = L.geoJSON(storeList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (Feature, latlng) {
    return L.marker(latlng);
  },
});
shopLayer.addTo(map);

// to fly to the market with certain zoom and animation when we click on outlet number on left side
function flyToshop(store) {
  map.flyTo(
    [store.geometry.coordinates[1], store.geometry.coordinates[0]],
    14,
    { duration: 3 }
  );
  setTimeout(() => {
    // to delay the opening of popup
    // ot open popup when we click on a tag on line 20 we have added event listener for it already
    L.popup({ closeButton: false, offset: L.point(0, -8) })
      .setLatLng([store.geometry.coordinates[1], store.geometry.coordinates[0]])
      .setContent(makeContent(store))
      .openOn(map);
  }, 3000);
}
