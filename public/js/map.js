const mapContainer = document.getElementById("map");

if (mapContainer && window.mapboxgl && mapToken && mapToken !== "undefined") {
    const coordinates = listing.geometry?.coordinates || [77.209, 28.6139];
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard-satellite',
        projection: 'globe',
        zoom: 12,
        center: coordinates,
    });

    new mapboxgl.Marker({ color: 'black' })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking.</p>`))
        .addTo(map);
} else if (mapContainer) {
    mapContainer.innerHTML = "<p class='text-muted'>Map is unavailable until Mapbox is configured.</p>";
}

