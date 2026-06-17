import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseMap } from './defense-map';

describe('DefenseMap', () => {
  let component: DefenseMap;
  let fixture: ComponentFixture<DefenseMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefenseMap],
    }).compileComponents();

    fixture = TestBed.createComponent(DefenseMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
