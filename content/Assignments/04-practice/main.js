var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'style@440_theme@light_lang@en.json', // style URL for basemap
    center: [-73.97144, 40.70491], // starting position [lng, lat]
    zoom: 6 // starting zoom
});
    
map.addControl(new maplibregl.NavigationControl());

map.on('load', () => {
    const jsonFeatures =  fetch(
        "https://data.cityofnewyork.us/resource/43nn-pn8j.geojson"
    )
  .then((response) => response.json())
  .then((data) => {
        console.log(data);
        data.features.forEach((feature) => {
            feature.geometry = {
                type: "Point",
                coordinates: [
                    Number(feature.properties.longitude),
                    Number(feature.properties.latitude),
                ],
            };
        });
        map.addSource('restaurants', {
            type: 'geojson',
            data: data
        });
        map.addLayer({
            'id': 'restaurants-layer',
            'type': 'circle',
            'source': 'restaurants',
            paint: {
                "circle-radius": 3,
                "circle-stroke-width": 0,
                "circle-color": ['match', ['get', 'cuisine_description'], 'Pizza', '#d10909', '#383431'],
                "circle-stroke-color": "white",
            },
        });
    });
    map.on('click', 'restaurants-layer', (e) => {
        console.log(e.features[0]);
        const coordinates = e.features[0].geometry.coordinate.sl;
        const description = e.features[0].properties.dba;

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
});