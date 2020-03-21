
import "https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js";

const mapbox_tokenn = "pk.eyJ1IjoiaHRraGFuaCIsImEiOiJjazgxdGE0OGwwc253M2ZwZzY5aDAwOWx3In0.ykhh--iPz6wwHM8MFe1tKQ";

mapboxgl.accessToken = mapbox_tokenn;

// style can be streets-v11, dark-v10

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 1.5,
    center: [0, 20]
});

const getColorByInfectedCount = count => {
    if (count >= 100) {
        return "red";
    }
    if (count >= 10) {
        return "blue";
    }
    if (count >= 1) {
        return "gray";
    }
    return "green";
}

fetch('/get-places.json')
.then(response => response.json())
.then(data => {
    const reports = data.data;
    reports
        .filter(report => !report.hide)
        .forEach(report => {
            const {name, country, longitude, latitude, infected, sick, dead, recovered} = report;
            // create the popup
            var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                "<ul>"
                    + "<li>Infected: "  + infected + "</li>"
                    + '<li>Sick: ' + sick + "</li>"
                    + '<li>Recovered: ' + recovered + "</li>"
                    + '<li>Confirm dead: ' + dead + "</li>"
                + "</ul>"
            );

            var el = document.createElement('div');
            el.id = 'marker';

            new mapboxgl.Marker({
                color: getColorByInfectedCount(infected)
            })
            .setPopup(popup)
            .setLngLat([longitude, latitude]).addTo(map);
        })
})