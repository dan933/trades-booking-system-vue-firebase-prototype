import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSettingsComponent } from './organisation-settings.component';

describe('OrganisationSettingsComponent', () => {
  let component: OrganisationSettingsComponent;
  let fixture: ComponentFixture<OrganisationSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationSettingsComponent]
    });
    fixture = TestBed.createComponent(OrganisationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
