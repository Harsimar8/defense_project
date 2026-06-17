import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-table.html'
})
export class AssetTableComponent {

  @Input() assets: any[] = [];

  @Output() delete = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<any>();

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onToggle(asset: any) {
    this.toggle.emit(asset);
  }
}