import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRouteComponent } from './new-route.component';

describe('NewRouteComponent', () => {
  let component: NewRouteComponent;
  let fixture: ComponentFixture<NewRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRouteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
