import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MTTAComponent } from './mtta.component';

describe('MTTAComponent', () => {
  let component: MTTAComponent;
  let fixture: ComponentFixture<MTTAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MTTAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MTTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
