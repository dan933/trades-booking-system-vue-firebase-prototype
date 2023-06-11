import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpperatingSettingsComponent } from './opperating-settings.component';

describe('OpperatingSettingsComponent', () => {
  let component: OpperatingSettingsComponent;
  let fixture: ComponentFixture<OpperatingSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpperatingSettingsComponent]
    });
    fixture = TestBed.createComponent(OpperatingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
