let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL).then(function (data){
    console.log(data.features)
    createFeatures(data.features)
})

function createFeatures(earthquakeData){
    let earthquakeArray = [];
    earthquakeData.forEach(location=>{
        let color = "";
        if (location.geometry.coordinates[2]<10){
            color = '#3CFF33'
        }
        else if (location.geometry.coordinates[2]>=10 && location.geometry.coordinates[2]<30){
            color = '#B2FF33'
        }
        else if (location.geometry.coordinates[2]>=30 && location.geometry.coordinates[2]<50){
            color = '#FEED3F'
        }
        else if (location.geometry.coordinates[2]>=50 && location.geometry.coordinates[2]<70){
            color = '#FEB93F'
        }
        else if (location.geometry.coordinates[2]>=70 && location.geometry.coordinates[2]<90){
            color = '#FE933F'
        }
        else if (location.geometry.coordinates[2]>=90){
            color = 'red'
        }
        earthquakeArray.push(
            L.circle([location.geometry.coordinates[1],location.geometry.coordinates[0]],{
                stroke: false,
                fillOpacity: 0.75,
                color:"white",
                fillColor:color,
                radius: location.properties.mag * 50000
            })
            .bindPopup("<h3>" + location.properties.place +
                        "</h3><hr><p>" + new Date(location.properties.time) + "</p>" +
                        "<hr><p> Depth: " + location.geometry.coordinates[2]
            )
        )
    })
    console.log(earthquakeArray)
    createMap(earthquakeArray);
}

function createMap(earthquakeArray){
    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    let earthquakeLayer = L.layerGroup(earthquakeArray)

    let baseMap = {
        "Dark Map":darkmap
    }

    let overlayMap = {
        "Earthquakes":earthquakeLayer
    }

    let myMap = L.map('map',{
        center: [37,-95],
        zoom: 5,
        layers:[darkmap,earthquakeLayer]
    })

    L.control.layers(baseMap,overlayMap, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({position:'bottomright'});
    legend.onAdd = function(){
        let div = L.DomUtil.create('div','Earthquakes Legend');
        let limits = earthquakeArray.forEach(data=>
                        data.options.limits
        )
        let colors = earthquakeLayer.options.fillColor
        console.log(limits.length)
        let lebels = []

        div.innerHTML = '<h2>Depth of Earthquakes</h2> \
        <div class="labels"><div class="min">' + limits[0] + '</div> \
              <div class="max">' + limits[limits.length - 1] + '</div></div>'

        limits.forEach(function(limit,index){
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }

    legend.addTo(myMap)
}