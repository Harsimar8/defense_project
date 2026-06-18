import { Component, Input, OnChanges, OnDestroy, SimpleChanges,inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeocodeService } from '../../services/geocode'; // Adjust path if needed

import * as L from 'leaflet';

@Component({
  selector: 'app-defense-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './defense-map.html',
  styleUrls: ['./defense-map.css']
})
export class DefenseMapComponent implements OnChanges, OnDestroy {
  @Input() assets: any[] = [];
  private geoService = inject(GeocodeService);

  private map!: L.Map;
  private markerGroup!: L.LayerGroup;
  private coordCache: { [key: string]: [number, number] } = {};
  private isUpdating = false;
  // Initialize with a default controller
  private abortController: AbortController = new AbortController();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assets']) {
      // 1. Cancel ongoing fetches for old data
      this.abortController.abort();
      
      // 2. Create a new controller for the new data
      this.abortController = new AbortController();

      this.initMap();
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    // Cleanup: Ensure no pending requests run after component is destroyed
    this.abortController.abort();
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

  private async getCoordinates(location: string, signal: AbortSignal): Promise<[number, number] | null> {
    if (!location) return null;
    if (this.coordCache[location]) return this.coordCache[location];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)},India&limit=1`;
      const res = await fetch(url, { 
        headers: { 'User-Agent': 'DefenseApp/1.0' },
        signal 
      });

      if (res.status === 429) return null; 

      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        this.coordCache[location] = coords;
        return coords;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error('Geocoding error:', err);
    }
    return null;
  }

   // Inside updateMarkers in defense-map.ts
   private async updateMarkers(): Promise<void> {
  // 1. Prevent concurrent runs of the update logic
  if (this.isUpdating || !this.markerGroup) return;
  this.isUpdating = true;

  try {
    const currentAssetIds = new Set(this.assets.map(a => a.id));

    // 2. Remove markers for assets that no longer exist
    this.markerGroup.eachLayer((layer: any) => {
      if (layer.assetId && !currentAssetIds.has(layer.assetId)) {
        this.markerGroup.removeLayer(layer);
      }
    });

    // 3. Identify ONLY new assets not yet on the map
    const existingMarkerIds = new Set<string>();
    this.markerGroup.eachLayer((layer: any) => {
      if (layer.assetId) existingMarkerIds.add(layer.assetId);
    });

    const assetsToProcess = this.assets.filter(a => !existingMarkerIds.has(a.id));

    // 4. Sequential processing (crucial to avoid flooding the API)
    for (const asset of assetsToProcess) {
      // Check if component was destroyed or data changed
      if (this.abortController.signal.aborted) break;

      // The Service queue ensures that even with multiple calls, 
      // requests are spaced out by 1.5s.
      const coords = await this.geoService.getCoordinates(asset.location);

      if (coords) {
        const color = asset.status === 'Active' ? '#28a745' : 
                      asset.status === 'Maintenance' ? '#dc3545' : '#6c757d';
        
        const icon = L.divIcon({
          html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
          className: ''
        });

        const marker = L.marker(coords, { icon })
          .bindPopup(`<b>${asset.name}</b><br>Status: ${asset.status}<br>Location: ${asset.location}`);
        
        marker.addTo(this.markerGroup);
        (marker as any).assetId = asset.id;
      }
    }
  } catch (error) {
    console.error('Error updating markers:', error);
  } finally {
    this.isUpdating = false;
  }
}
}