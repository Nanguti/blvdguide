import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const mapService = {
  createMap(container: string, coordinates: [number, number]) {
    return new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom: 14,
    });
  },

  addMarker(
    map: mapboxgl.Map,
    coordinates: [number, number],
    color = "#FF0000"
  ) {
    new mapboxgl.Marker({ color }).setLngLat(coordinates).addTo(map);
  },
};
