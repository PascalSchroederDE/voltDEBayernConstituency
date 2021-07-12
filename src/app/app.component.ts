import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import geomap_bayern_landkreise from '../assets/geomap_bayern_landkreise.json';
import voltData from '../assets/voltData.json'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name = 'Angular';
  map:any;
  geoJson;

  ngOnInit() {
    this.map = L.map('map').setView([49, 11.5], 8);
    let mapboxAccessToken = "pk.eyJ1IjoicGFzY2FsLXNjaHJvZWRlciIsImEiOiJja3IwbXF4YmYwMjB0Mm9yeHA5Mmw0NWE4In0.Blby2o4TfCd3Xe2nVvBmJA";
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      attribution: 'Imagery <a href="https://www.mapbox.com/about/maps/">© Mapbox</a>, Map data <a href="https://www.openstreetmap.org/about/">© OpenStreetMap</a> contributors, <a href="https://apps.mapbox.com/feedback/#/-74.5/40/10">Improve this map</a>',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);
    this.geoJson = L.geoJson(geomap_bayern_landkreise, {style: this.style, onEachFeature: this.onEachFeature}).addTo(this.map);
    info.addTo(this.map);
    area.addTo(this.map)

  }

  onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: updateInfo
    });

    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }

      area.update(layer.feature.properties.GEN)

    }
  
    function resetHighlight(e) {
      layer.setStyle({
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function updateInfo(e) {
    info.update(layer.feature.properties);
  }
  
}


  style(feature) {
    function getColor(data) {
      if(data.assigned==false) {
        return "#FDC220";
      }
      return data.progress >= 100 ? '#502379' :
      data.progress >= 90  ? '#542c79' :
      data.progress >= 80  ? '#583479' :
      data.progress >= 70  ? '#5c3d79' :
      data.progress >= 60  ? '#5f4379' :
      data.progress >= 50  ? '#634a79' :
            data.progress >= 40  ? '#675279' :
            data.progress >= 30  ? '#695779' :
            data.progress >= 20  ? '#6b5c79' :
            data.progress >= 10  ? '#6d6179' :
            data.progress >= 0  ? '#706779' : "#fffff" 
    }
    return {
        fillColor: getColor(voltData[feature.properties.GEN]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
  }
}

var area = L.control();
area.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'area'); 
  this._div.style="background-color: rgba(255, 255, 255, 0.7); width: 20vw; font-size: 20px; position:fixed; bottom:5vh; right: 40vw; border-radius:5px; text-align:center";
  this._div.innerHTML="Fahr über einen Bezirk"
  return this._div;
}

area.update = function(area) {
  this._div.innerHTML = area;
}

let info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); 
  this._div.style="border: 2px solid #502379; padding: 6px 8px; font: 18px Ubuntu, Helvetica, sans-serif; background: white; background: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(0,0,0,0.2); min-width: 25vw; border-radius: 10px;"
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4 style="margin: 0 0 10px; color: #502379; font-size: 26px"">' + 'Klick auf einen Bezirk' + '</h4><table>' +  
  '<tr><td><b>Zugewiesen:</b></td><td>' + '</td></tr>' + 
  '<tr><td><b>Team:</b></td><td>' + '</td></tr>' + 
  '<tr><td><b>Kontaktperson:</b></td><td>'  + '</td></tr>' + 
  '<tr><td><b>Forschritt:</b></td><td>' + '</td></tr>' + 
    '</table><br>' + 
    '<a style="color:#444;font-size: 16px">Kein Link hinterlegt</a>';

  if(props) {
    let data = voltData[props.GEN];
    this._div.innerHTML = '<h4 style="margin: 0 0 10px; color: #502379; font-size: 26px"">' + props.GEN + '</h4><table>' +  
    '<tr><td><b>Zugewiesen:</b></td><td>' + data.assigned + '</td></tr>' + 
    '<tr><td><b>Team:</b></td><td>' + data.team + '</td></tr>' + 
    '<tr><td><b>Kontaktperson:</b></td><td>' + data.contact + '</td></tr>' + 
    '<tr><td><b>Forschritt:</b></td><td>' + data.progress + '%</td></tr>' + '</table><br>' + 
    (data.link!="" ? '<a style="color: #502379; font-size: 16px; text-decoration:none; " href="'+data.link+'" target="_blank">Weiterführender Link</a>' : '<a style="color:#444;font-size: 16px">Kein Link hinterlegt</a>');
  }
};