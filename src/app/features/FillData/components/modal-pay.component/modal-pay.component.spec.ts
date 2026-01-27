import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPayComponent } from './modal-pay.component';

describe('ModalPayComponent', () => {
  let component: ModalPayComponent;
  let fixture: ComponentFixture<ModalPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
