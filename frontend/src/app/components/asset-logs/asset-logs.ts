import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-logs.html',
  styleUrls: ['./asset-logs.css']
})
export class AssetLogsComponent {

  @Input() logs: any[] = [];
}