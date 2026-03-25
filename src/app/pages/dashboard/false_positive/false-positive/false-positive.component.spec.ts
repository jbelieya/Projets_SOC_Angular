import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalsePositiveComponent } from './false-positive.component';

describe('FalsePositiveComponent', () => {
  let component: FalsePositiveComponent;
  let fixture: ComponentFixture<FalsePositiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FalsePositiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalsePositiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
