import { Component } from '@angular/core';
import { AssetListComponent } from './components/asset-list/asset-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AssetListComponent],
  template: `<app-asset-list></app-asset-list>`
})
export class App {}