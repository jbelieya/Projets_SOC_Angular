import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedIncidentsComponent } from './closed-incidents.component';

describe('ClosedIncidentsComponent', () => {
  let component: ClosedIncidentsComponent;
  let fixture: ComponentFixture<ClosedIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
