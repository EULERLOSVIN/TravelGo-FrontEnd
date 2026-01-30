import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalesComponent } from './admin-sales.page';

describe('AdminSalesComponent', () => {
  let component: AdminSalesComponent;
  let fixture: ComponentFixture<AdminSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSalesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
