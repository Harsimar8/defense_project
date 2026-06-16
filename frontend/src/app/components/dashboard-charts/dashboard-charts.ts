import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="charts-row-container">
      <div class="chart-wrapper-card">
        <h4 class="chart-title-header">⚡ OPERATIONAL STATUS MATRIX</h4>
        <div class="canvas-responsive-holder">
          <canvas id="statusPieChart"></canvas>
        </div>
      </div>

      <div class="chart-wrapper-card">
        <h4 class="chart-title-header">🛡️ CLASSIFICATION SYSTEM UNITS</h4>
        <div class="canvas-responsive-holder">
          <canvas id="typePieChart"></canvas>
        </div>
      </div>

      <div class="chart-wrapper-card">
        <h4 class="chart-title-header">🌐 STATION DEPLOYMENT MAP</h4>
        <div class="canvas-responsive-holder">
          <canvas id="locationPieChart"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Enforces all three charts to sit in a single horizontal row */
    .charts-row-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 15px 0 30px 0;
      gap: 1.5%;
      box-sizing: border-box;
    }

    /* Assigns equal percentage distribution with a clean look */
    .chart-wrapper-card {
      flex: 0 0 32%; /* Exact proportional percentage layout */
      min-width: 240px;
      background: #ffffff;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
      text-align: center;
    }

    /* Clean typography labels above charts */
    .chart-title-header {
      margin: 0 0 12px 0;
      font-size: 11px;
      color: #4a5568;
      letter-spacing: 0.8px;
      font-family: monospace;
      border-bottom: 1px solid #edf2f7;
      padding-bottom: 6px;
    }

    /* Strict wrapper to keep Chart.js from expanding unexpectedly */
    .canvas-responsive-holder {
      position: relative;
      width: 100%;
      height: 200px; /* Constrains charts to a uniform, standard size */
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    canvas {
      max-width: 100% !important;
      max-height: 100% !important;
    }

    /* Responsive adjustment for small laptop monitors */
    @media (max-width: 900px) {
      .charts-row-container {
        flex-wrap: wrap;
        gap: 15px;
      }
      .chart-wrapper-card {
        flex: 1 1 100%;
      }
    }
  `]
})
export class DashboardChartsComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() assetsList: any[] = [];

  private statusChart: any = null;
  private typeChart: any = null;
  private locationChart: any = null;
  private isViewInitialized = false;

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.renderAllCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetsList'] && this.isViewInitialized) {
      this.renderAllCharts();
    }
  }

  private renderAllCharts() {
    if (!this.assetsList || this.assetsList.length === 0) return;
    this.buildStatusPieChart();
    this.buildTypePieChart();
    this.buildLocationPieChart();
  }

  private buildStatusPieChart() {
    if (this.statusChart) this.statusChart.destroy();
    const canvas = document.getElementById('statusPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.statusChart = new Chart<any, any>(canvas, {
      type: 'pie',
      data: {
        labels: ['Active', 'Maintenance', 'Standby'],
        datasets: [{
          data: ['Active', 'Maintenance', 'Standby'].map(s => this.assetsList.filter(a => a.status === s).length),
          backgroundColor: ['#38a169', '#e53e3e', '#718096'],
          borderWidth: 1
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } 
      }
    });
  }

  private buildTypePieChart() {
    if (this.typeChart) this.typeChart.destroy();
    const map = this.assetsList.reduce((acc: any, c) => { if (c.type) acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {});
    const canvas = document.getElementById('typePieChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.typeChart = new Chart<any, any>(canvas, {
      type: 'pie',
      data: { 
        labels: Object.keys(map).length ? Object.keys(map) : ['None'], 
        datasets: [{ data: Object.values(map).length ? Object.values(map) : [0], backgroundColor: ['#3182ce', '#dd6b20', '#805ad5', '#319795', '#ecc94b'], borderWidth: 1 }] 
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } 
      }
    });
  }

  private buildLocationPieChart() {
    if (this.locationChart) this.locationChart.destroy();
    const map = this.assetsList.reduce((acc: any, c) => { if (c.location) acc[c.location] = (acc[c.location] || 0) + 1; return acc; }, {});
    const canvas = document.getElementById('locationPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.locationChart = new Chart<any, any>(canvas, {
      type: 'pie',
      data: { 
        labels: Object.keys(map).length ? Object.keys(map) : ['None'], 
        datasets: [{ data: Object.values(map).length ? Object.values(map) : [0], backgroundColor: ['#ecc94b', '#4a5568', '#319795', '#e53e3e', '#38a169'], borderWidth: 1 }] 
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } 
      }
    });
  }

  ngOnDestroy() {
    if (this.statusChart) this.statusChart.destroy();
    if (this.typeChart) this.typeChart.destroy();
    if (this.locationChart) this.locationChart.destroy();
  }
}