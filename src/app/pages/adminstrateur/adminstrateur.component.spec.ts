import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstrateurComponent } from './adminstrateur.component';

describe('AdminstrateurComponent', () => {
  let component: AdminstrateurComponent;
  let fixture: ComponentFixture<AdminstrateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminstrateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminstrateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
