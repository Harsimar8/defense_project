import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPortal } from './auth-portal';

describe('AuthPortal', () => {
  let component: AuthPortal;
  let fixture: ComponentFixture<AuthPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPortal],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPortal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
