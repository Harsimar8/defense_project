import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-list.html'
})
export class AssetListComponent implements OnInit {

  assets: any[] = [];
  searchText: string = '';
  selectedStatus: string = '';

  newAsset: any = {
    name: '',
    type: '',
    status: 'Active', // Default choice
    location: ''
  };

  constructor(
    private assetService: AssetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = data || [];
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error("API ERROR:", err)
    });
  }

  // ✅ NEW: Toggle operational readiness status instantly
  toggleStatus(asset: any) {
    let nextStatus = 'Active';
    if (asset.status === 'Active') nextStatus = 'Maintenance';
    else if (asset.status === 'Maintenance') nextStatus = 'Standby';

    // Create updated object payload
    const updatedAsset = { ...asset, status: nextStatus };

    // Send PUT request to local backend API route
    this.assetService.updateAsset(asset.id, updatedAsset).subscribe({
      next: () => {
        console.log(`Asset ${asset.id} changed status to ${nextStatus}`);
        this.loadAssets(); // Fetch refreshed array from server
      },
      error: (err) => console.error('Failed to change operational status:', err)
    });
  }

  // ✅ NEW: Remove asset record from the defense grid database
  deleteAsset(id: any) {
    if (confirm('Are you sure you want to decommission this defense asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => {
          console.log(`Asset ${id} deleted successfully.`);
          this.loadAssets(); // Refresh layout structure immediately
        },
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