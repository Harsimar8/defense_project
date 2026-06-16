import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-export',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="export-actions-wrapper">
      <button (click)="exportToCSV()" class="tactical-export-btn">
        📥 Generate Operational CSV Report
      </button>
    </div>
  `,
  styles: [`
    .export-actions-wrapper {
      display: inline-block;
      margin-left: auto;
    }
    
    .tactical-export-btn {
      background: #2b6cb0; /* Deep Command Blue */
      color: white;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      font-family: monospace;
      font-size: 13px;
      cursor: pointer;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background 0.2s ease, transform 0.1s ease;
    }

    .tactical-export-btn:hover {
      background: #2b5296;
    }

    .tactical-export-btn:active {
      transform: scale(0.98);
    }
  `]
})
export class DataExportComponent {
  // ✅ Directly binds to the core real-time filtered array matching active screen filters
  @Input() dataToExport: any[] = [];

  exportToCSV() {
    if (!this.dataToExport || this.dataToExport.length === 0) {
      alert('Operational Error: No records present in current ledger state to process.');
      return;
    }

    // 1. Define explicit CSV header rows matching your defense columns
    const headers = ['System ID', 'Asset Name', 'Classification Type', 'Operational Status', 'Station Location'];

    // 2. Map and clean records data, escaping commas to prevent cell alignment errors
    const rows = this.dataToExport.map((asset, index) => [
      index + 1,
      `"${(asset.name || '').replace(/"/g, '""')}"`,
      `"${(asset.type || '').replace(/"/g, '""')}"`,
      `"${(asset.status || '').replace(/"/g, '""')}"`,
      `"${(asset.location || '').replace(/"/g, '""')}"`
    ]);

    // 3. Compile structure into comma-delimited string format rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Generate data stream blob configuration
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      // Create an automated file execution signature containing current log date
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `DEFENSE_ASSETS_REPORT_${timestamp}.csv`;

      // Trigger automatic browser down-stream delivery cycle
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}