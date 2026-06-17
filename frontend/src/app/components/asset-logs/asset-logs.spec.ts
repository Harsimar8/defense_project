import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLogs } from './asset-logs';

describe('AssetLogs', () => {
  let component: AssetLogs;
  let fixture: ComponentFixture<AssetLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
