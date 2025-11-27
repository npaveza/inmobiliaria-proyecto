import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonpayComponent } from './neonpay.component';

describe('NeonpayComponent', () => {
  let component: NeonpayComponent;
  let fixture: ComponentFixture<NeonpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeonpayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeonpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
