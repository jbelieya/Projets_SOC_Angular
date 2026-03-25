import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruePositivesComponent } from './true-positives.component';

describe('TruePositivesComponent', () => {
  let component: TruePositivesComponent;
  let fixture: ComponentFixture<TruePositivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruePositivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruePositivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
