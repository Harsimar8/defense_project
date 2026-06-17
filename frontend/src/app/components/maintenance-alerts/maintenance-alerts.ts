import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-alerts.html',
  styleUrls: ['./maintenance-alerts.css']
})
export class MaintenanceAlertsComponent {

  @Input() assets: any[] = [];

  get maintenanceAlerts() {
    if (!this.assets) return [];
    return this.assets.filter(a => a && a.status === 'Maintenance');
  }
}