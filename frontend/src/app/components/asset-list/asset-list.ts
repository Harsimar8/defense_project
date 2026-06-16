import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule ,} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset';
import { AuthPortalComponent } from '../auth-portal/auth-portal';
import { DataExportComponent } from '../data-export/data-export';


// ✅ STEP 1: IMPORT THE DASHBOARD CHARTS COMPONENT SIGNATURE
import { DashboardChartsComponent } from '../dashboard-charts/dashboard-charts';
import * as L from 'leaflet';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  // ✅ STEP 2: REGISTER BOTH STANDALONE SUB-COMPONENTS IN THE IMPORTS ARRAY
  imports: [CommonModule, FormsModule, AuthPortalComponent, DashboardChartsComponent, DataExportComponent],
  templateUrl: './asset-list.html'
})
export class AssetListComponent implements OnInit {

  isLoggedIn: boolean = false;
  activeUser: string = '';

  assets: any[] = [];
  logs: any[] = [];
  searchText: string = '';
  selectedStatus: string = '';
  
  private map!: L.Map; 
  private markerGroup!: L.LayerGroup; 

  newAsset: any = {
    name: '',
    type: '',
    status: 'Active',
    location: ''
  };

  constructor(
    private assetService: AssetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Session structural parameters managed dynamically via AuthPortal notifications
  }

  onLoginValidated(username: string) {
    this.isLoggedIn = true;
    this.activeUser = username;
    this.loadAssets();
  }

  logout() {
    this.isLoggedIn = false;
    this.activeUser = '';
    sessionStorage.clear();
    
    if (this.map) {
      this.map.remove();
      (this.map as any) = null;
    }
  }

  get maintenanceAlerts() {
    if (!this.assets) return [];
    return this.assets.filter(a => a && a.status === 'Maintenance');
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

  private async getCoordinates(locationName: string): Promise<[number, number] | null> {
    if (!locationName || locationName.trim() === '') return null;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName.trim())},+India&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'DefenseAssetManagerApp/1.0' }
      });
      const results = await response.json();

      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        return [lat, lon];
      }
      return null;
    } catch (error) {
      console.error(`Geocoding failed for: ${locationName}`, error);
      return null;
    }
  }

  private async updateMapMarkers() {
    if (!this.markerGroup) return;
    
    this.markerGroup.clearLayers();

    for (const asset of this.assets) {
      if (!asset.location) continue;

      const coords = await this.getCoordinates(asset.location);

      if (coords) {
        let markerColor = '#6c757d'; 
        if (asset.status === 'Active') markerColor = '#28a745'; 
        if (asset.status === 'Maintenance') markerColor = '#dc3545'; 

        const customIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
          className: 'custom-tactical-ping',
          iconSize: [14, 14]
        });

        const marker = L.marker(coords, { icon: customIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <strong style="font-size:14px; color:#212529;">${asset.name}</strong><br>
              <strong>Class:</strong> ${asset.type}<br>
              <strong>Status:</strong> <span style="color:${markerColor}; font-weight:bold;">${asset.status}</span><br>
              <strong>Station:</strong> ${asset.location}
            </div>
          `);

        this.markerGroup.addLayer(marker);
      }
    }
  }

  loadAssets() {
    this.assetService.getAssets().subscribe({
      next: (data: any) => {
        this.assets = data?.assets || [];
        this.logs = data?.logs || [];
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.initMap();
          this.updateMapMarkers();
        }, 100);
      },
      error: (err) => console.error("API ERROR:", err)
    });
  }

  toggleStatus(asset: any) {
    let nextStatus = 'Active';
    if (asset.status === 'Active') nextStatus = 'Maintenance';
    else if (asset.status === 'Maintenance') nextStatus = 'Standby';

    const updatedAsset = { ...asset, status: nextStatus };

    this.assetService.updateAsset(asset.id, updatedAsset).subscribe({
      next: () => this.loadAssets(),
      error: (err) => console.error('Failed to change operational status:', err)
    });
  }

  deleteAsset(id: any) {
    if (confirm('Are you sure you want to decommission this defense asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => this.loadAssets(),
        error: (err) => console.error('Failed to clear asset record:', err)
      });
    }
  }

  get filteredList() {
    if (!this.assets || this.assets.length === 0) return [];
    return this.assets
      .filter(a => a && a.name) 
      .filter(a => this.selectedStatus ? a.status === this.selectedStatus : true)
      .filter(a =>
        (a.name ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.type ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.status ?? '').toLowerCase().includes(this.searchText.toLowerCase())
      );
  }

  get uniqueStatuses() {
    if (!this.assets || this.assets.length === 0) return [];
    return [...new Set(this.assets.map(a => a?.status).filter(Boolean))];
  }

  getCount(status: string) {
    if (!this.assets || this.assets.length === 0) return 0;
    return this.assets.filter(a => a && a.status === status).length;
  }

  addAsset() {
    this.assetService.addAsset(this.newAsset).subscribe({
      next: () => {
        this.loadAssets(); 
        this.newAsset = { name: '', type: '', status: 'Active', location: '' };
      },
      error: (err) => console.error('Error adding asset:', err)
    });
  }
}