import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-defense-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './defense-map.html',
  styleUrls: ['./defense-map.css']
})
export class DefenseMapComponent implements OnChanges {

  @Input() assets: any[] = [];

  private map!: L.Map;
  private markerGroup!: L.LayerGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assets']) {
      setTimeout(() => {
        this.initMap();
        this.updateMarkers();
      }, 100);
    }
  }

  private initMap() {
    if (this.map) return;

    this.map = L.map('defenseMap', {
      center: [22.9734, 78.6568],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  private async getCoordinates(location: string): Promise<[number, number] | null> {
    if (!location) return null;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)},India&limit=1`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'DefenseApp/1.0' }
      });

      const data = await res.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  }

  private async updateMarkers() {
    if (!this.markerGroup) return;

    this.markerGroup.clearLayers();

    for (const asset of this.assets) {
      if (!asset.location) continue;

      const coords = await this.getCoordinates(asset.location);

      if (!coords) continue;

      let color = '#6c757d';
      if (asset.status === 'Active') color = '#28a745';
      if (asset.status === 'Maintenance') color = '#dc3545';

      const icon = L.divIcon({
        html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
        className: ''
      });

      const marker = L.marker(coords, { icon })
        .bindPopup(`
          <b>${asset.name}</b><br>
          Type: ${asset.type}<br>
          Status: ${asset.status}<br>
          Location: ${asset.location}
        `);

      this.markerGroup.addLayer(marker);
    }
  }
}