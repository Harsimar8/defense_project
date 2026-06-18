import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AssetService } from '../../services/asset';

import { AuthPortalComponent } from '../auth-portal/auth-portal';
import { DashboardChartsComponent } from '../dashboard-charts/dashboard-charts';
import { DataExportComponent } from '../data-export/data-export';
import { MaintenanceAlertsComponent } from '../maintenance-alerts/maintenance-alerts';
import { AssetLogsComponent } from '../asset-logs/asset-logs';
import { AssetFormComponent } from '../asset-form/asset-form';
import { DefenseMapComponent } from '../defense-map/defense-map';
import { AssetTableComponent } from '../asset-table/asset-table';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthPortalComponent,
    DashboardChartsComponent,
    DataExportComponent,
    MaintenanceAlertsComponent,
    AssetLogsComponent,
    AssetFormComponent,
    DefenseMapComponent,
    AssetTableComponent
  ],
  templateUrl: './asset-list.html',
  styleUrls: ['./asset-list.css']
})
export class AssetListComponent implements OnInit {

  isLoggedIn = false;
  activeUser = '';

  assets: any[] = [];
  logs: any[] = [];

  searchText = '';
  selectedStatus = '';

  // Inject ChangeDetectorRef to force UI refresh
  constructor(
    private assetService: AssetService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const sessionActive = sessionStorage.getItem('active_defense_session');
    const user = sessionStorage.getItem('session_user');

    if (sessionActive === 'true' && user) {
      this.isLoggedIn = true;
      this.activeUser = user;
      this.loadAssets();
    }
  }

  onLoginValidated(username: string) {
    this.isLoggedIn = true;
    this.activeUser = username;

    sessionStorage.setItem('active_defense_session', 'true');
    sessionStorage.setItem('session_user', username);

    this.loadAssets();
  }

  logout() {
    this.isLoggedIn = false;
    this.activeUser = '';
    sessionStorage.removeItem('active_defense_session');
    sessionStorage.removeItem('session_user');
  }

  loadAssets() {
    this.assetService.getAssets().subscribe({
      next: (data: any) => {
        console.log('Full Response Received:', data);

        if (Array.isArray(data)) {
          this.assets = data;
        } else if (data && data.assets) {
          this.assets = data.assets;
          this.logs = data.logs || [];
        }

        console.log('Final Assets State:', this.assets);
        
        // CRITICAL: Tell Angular to detect changes after data is loaded
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Fetch Error:', err)
    });
  }

  addAsset(asset: any) {
    this.assetService.addAsset(asset).subscribe(() => this.loadAssets());
  }

  // In asset-list.ts
  // In asset-list.ts
toggleStatus(asset: any) {
  const originalStatus = asset.status;
  // Instant visual update
  asset.status = (asset.status === 'Active') ? 'Maintenance' : 'Active';
  
  // Force Change Detection for immediate UI refresh
  this.cdr.markForCheck(); 

  this.assetService.updateAsset(asset.id, asset).subscribe({
    error: (err) => {
      console.error('Update failed:', err);
      asset.status = originalStatus; // Revert if failed
      this.cdr.markForCheck();
    }
  });
}

  deleteAsset(id: any) {
    this.assetService.deleteAsset(id).subscribe(() => this.loadAssets());
  }

  get filteredList() {
    return this.assets
      .filter(a =>
        (a.name ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.type ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.status ?? '').toLowerCase().includes(this.searchText.toLowerCase())
      )
      .filter(a => this.selectedStatus ? a.status === this.selectedStatus : true);
  }

  get uniqueStatuses() {
    return [...new Set(this.assets.map(a => a.status).filter(Boolean))];
  }

  getCount(status: string) {
    return this.assets.filter(a => a.status === status).length;
  }
}