let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL).then(function (data){
    console.log(data.features)
    createFeatures(data.features)
})

function createFeatures(earthquakeData){
    console.log(earthquakeData[0])
    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    let baseMaps = {
        "Dark Map": darkmap
    }

    // let overlayMaps = {
    //     Earthquakes: earthquakes
    // }

    let myMap = L.map("map", {
        center: [37.09,-95.71],
        zoom: 5,
        layers:[darkmap]
    })

    let earthquakes = earthquakeData.forEach(data=>{
        console.log(data)
        L.circle([data.geometry.coordinates[0], data.geometry.coordinates[1]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: "blue",
            radius: data.properties.mag * 1000})
        .bindPopup("<h3>" + data.properties.place +
                    "</h3><hr><p>" + new Date(data.properties.time) + "</p>" +
                    "<hr><p> Depth: " + data.geometry.coordinates[2]).addTo(myMap);;
    })
    // let geoData = JSON.parse(earthquakeData)
    // console.log(geoData)
    // function onEachFeature(feature, layer){
    //     // layer.bindPopup("<h3>" + feature.properties.place +
    //     //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
    //     //     "<hr><p> Depth: " + feature.geometry.coordinates[2])
            // L.circle([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
            //     fillOpacity: 0.75,
            //     color: "white",
            //     fillColor: "blue",
            //     radius: feature.properties.mag * 1000})
            //  .bindPopup("<h3>" + feature.properties.place +
            //             "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            //             "<hr><p> Depth: " + feature.geometry.coordinates[2]).addTo(myMap);;
    // }
    // console.log('binding popups')
    // let earthquakes = L.geoJSON(earthquakeData, {
    //     onEachFeature: onEachFeature
    // })
    
    
    // console.log('running createMap function')
    // createMap(earthquakes);

}

function createMap(earthquakes){
    console.log('creating darkmap layer')
    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  console.log('assigning labels for layers')
  let baseMaps = {
      "Dark Map": darkmap
  }

  console.log('creating overlay')
  let overlayMaps = {
      Earthquakes: earthquakes
  }

  console.log('creating mymap and adding to html')
  let myMap = L.map("map", {
      center: [37.09,-95.71],
      zoom: 5,
      layers:[darkmap]
  })

  console.log('adding layers to map')
  
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

//   L.getLayers().forEach(function (obj){
//       if (obj instanceof L.marker){
//           L.circle(obj.getLatLng(),1609.34,{
//               color: 'blue',
//               fillColor:'blue'
//           }).addTo(myMap)
//       }
//   })

}