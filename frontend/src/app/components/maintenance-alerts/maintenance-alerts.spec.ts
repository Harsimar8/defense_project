import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAlerts } from './maintenance-alerts';

describe('MaintenanceAlerts', () => {
  let component: MaintenanceAlerts;
  let fixture: ComponentFixture<MaintenanceAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
