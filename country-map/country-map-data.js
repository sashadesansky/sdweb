/*
  Data for the Country Comparison Map.

  window.WORLD_GEOJSON (loaded from world-geojson.js first) supplies a
  polygon per country for most of the world — derived from a public,
  simplified world-countries GeoJSON dataset (coordinates rounded to ~1km
  precision to keep the file small; plenty of precision for a world-scale
  map like this).

  A handful of places people travel to are territories/regions that don't
  get their own polygon in a country-level dataset (their land is drawn as
  part of a bigger country, or isn't included at all). Those are listed in
  PIN_TERRITORIES below and are shown instead as a colored pin at their
  approximate location, clearly marked as such in the UI.
*/

(function () {
  "use strict";

  // Places that don't have their own polygon in WORLD_GEOJSON, shown as a
  // pin instead. lat/lon are approximate — fine for a world-scale map.
  window.PIN_TERRITORIES = [
    { name: "Hong Kong", lat: 22.32, lon: 114.17 },
    { name: "Aruba", lat: 12.52, lon: -69.97 },
    { name: "U.S. Virgin Islands", lat: 18.34, lon: -64.90 },
    { name: "Caribbean (other islands)", lat: 15.0, lon: -70.0 }
  ];

  // Sasha's own list, mapped to the exact names used in WORLD_GEOJSON or
  // in PIN_TERRITORIES above.
  window.SASHA_COUNTRIES = [
    "United States of America",
    "Canada",
    "Mexico",
    "Dominican Republic",
    "Caribbean (other islands)",
    "U.S. Virgin Islands",
    "Puerto Rico",
    "Aruba",
    "Peru",
    "Ecuador",
    "Belgium",
    "Netherlands",
    "Denmark",
    "United Kingdom",
    "Spain",
    "France",
    "Portugal",
    "Morocco",
    "Tunisia",
    "Turkey",
    "Czech Republic",
    "Ukraine",
    "Italy",
    "Germany",
    "South Korea",
    "Japan",
    "China",
    "Thailand",
    "Switzerland",
    "Hong Kong",
    "Israel"
  ];
})();
