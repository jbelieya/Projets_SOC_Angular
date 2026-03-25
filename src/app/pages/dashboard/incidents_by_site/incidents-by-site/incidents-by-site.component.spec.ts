import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsBySiteComponent } from './incidents-by-site.component';

describe('IncidentsBySiteComponent', () => {
  let component: IncidentsBySiteComponent;
  let fixture: ComponentFixture<IncidentsBySiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsBySiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentsBySiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
