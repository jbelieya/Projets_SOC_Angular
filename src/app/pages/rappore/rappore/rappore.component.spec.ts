import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapporeComponent } from './rappore.component';

describe('RapporeComponent', () => {
  let component: RapporeComponent;
  let fixture: ComponentFixture<RapporeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapporeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapporeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
