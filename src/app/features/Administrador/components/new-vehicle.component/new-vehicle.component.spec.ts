import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehicleComponent } from './new-vehicle.component';

describe('NewVehicleComponent', () => {
  let component: NewVehicleComponent;
  let fixture: ComponentFixture<NewVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVehicleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
