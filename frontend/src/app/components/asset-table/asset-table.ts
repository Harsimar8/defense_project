import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-table.html',
  styleUrls: ['./asset-table.css']
})
export class AssetTableComponent {
  // 1. ADD THE @Input DECORATOR
  @Input() assets: any[] = [];

  @Output() delete = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<any>();

  // 2. DEFINE THE METHODS THE TEMPLATE IS LOOKING FOR
  onDelete(id: number) {
    this.delete.emit(id);
  }

  onToggle(asset: any) {
    this.toggle.emit(asset);
  }
}