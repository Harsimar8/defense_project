import { Component, OnInit } from '@angular/core';
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
    status: '',
    location: ''
  };

  constructor(private assetService: AssetService) {}

  // ✅ AUTO LOAD ON PAGE REFRESH
  ngOnInit() {
  console.log("INIT RUNNING");
  this.loadAssets();
}

  // ✅ GET DATA FROM API
  loadAssets() {
  console.log("API CALLED");
  this.assetService.getAssets().subscribe(data => {
    console.log("DATA:", data);
    this.assets = data || [];
  });
}

  // ✅ FILTER LOGIC (SEARCH + STATUS)
  filteredAssets() {
    return this.assets
      .filter(a => a && a.name)
      .filter(a =>
        this.selectedStatus ? a.status === this.selectedStatus : true
      )
      .filter(a =>
        (a.name ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.type ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.status ?? '').toLowerCase().includes(this.searchText.toLowerCase())
      );
  }

  get filteredList() {
  return this.assets
    .filter(a => a && a.name)
    .filter(a =>
      this.selectedStatus ? a.status === this.selectedStatus : true
    )
    .filter(a =>
      (a.name ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (a.type ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (a.status ?? '').toLowerCase().includes(this.searchText.toLowerCase())
    );
}

  // ✅ UNIQUE STATUS LIST FOR DROPDOWN
  get uniqueStatuses() {
    return [...new Set(this.assets.map(a => a.status))];
  }

  // ✅ COUNT BY STATUS
  getCount(status: string) {
    return this.assets.filter(a => a.status === status).length;
  }

  // ✅ ADD NEW ASSET
  addAsset() {
    this.assetService.addAsset(this.newAsset).subscribe({
      next: () => {
        this.loadAssets(); // refresh after add

        this.newAsset = {
          name: '',
          type: '',
          status: '',
          location: ''
        };
      },
      error: (err) => {
        console.error('Error adding asset:', err);
      }
    });
  }
}