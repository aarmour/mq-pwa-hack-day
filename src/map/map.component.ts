import { Component } from '@angular/core';

declare const mapboxgl: any;

@Component({
  moduleId: module.id,
  selector: 'mq-map',
  styleUrls: ['map.component.css'],
  templateUrl: 'map.component.html'
})
export class MapComponent {

  private map: any;

  constructor() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWFybW91ciIsImEiOiJjaXB4NW1lM3Ywd2FqZm9tMnl0cmZmcXpkIn0.NDfEUrCKD_VicFC4Ux_Whw';
  }

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9'
    });
  }

}
