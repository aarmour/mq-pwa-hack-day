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
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg';
  }

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'https://api.mapbox.com/styles/v1/mapquest/ciuike7qg000i2inyel1id74o?access_token=pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg'
    });
  }

}
