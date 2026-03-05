import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueAddDriver } from './queue-add-driver';

describe('QueueAddDriver', () => {
  let component: QueueAddDriver;
  let fixture: ComponentFixture<QueueAddDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueAddDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueAddDriver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
