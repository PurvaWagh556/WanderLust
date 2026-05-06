const map = L.map('map').setView(
  [listingData.coordinates[1], listingData.coordinates[0]],
  15
);
//Map style 1
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);


//Map style 2
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.marker(
  [listingData.coordinates[1], listingData.coordinates[0]],
  { icon: redIcon }
)
  .addTo(map)
  .bindPopup(`<b>${listingData.title}</b>
    <br>${listingData.location}
    <p>Exact location will be provided after booking</p>`)
  .openPopup;