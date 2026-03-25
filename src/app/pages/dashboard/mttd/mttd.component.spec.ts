import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MTTDComponent } from './mttd.component';

describe('MTTDComponent', () => {
  let component: MTTDComponent;
  let fixture: ComponentFixture<MTTDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MTTDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MTTDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
