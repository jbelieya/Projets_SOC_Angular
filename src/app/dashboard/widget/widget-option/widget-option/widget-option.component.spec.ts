import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetOptionComponent } from './widget-option.component';

describe('WidgetOptionComponent', () => {
  let component: WidgetOptionComponent;
  let fixture: ComponentFixture<WidgetOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
