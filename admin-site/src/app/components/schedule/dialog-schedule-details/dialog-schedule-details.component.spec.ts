import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogScheduleDetailsComponent } from './dialog-schedule-details.component';

describe('DialogScheduleDetailsComponent', () => {
  let component: DialogScheduleDetailsComponent;
  let fixture: ComponentFixture<DialogScheduleDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogScheduleDetailsComponent]
    });
    fixture = TestBed.createComponent(DialogScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
