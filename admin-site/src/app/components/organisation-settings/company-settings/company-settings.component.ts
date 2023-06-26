import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {
  companySettingsForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    number: ['', [Validators.required, Validators.pattern("^[0-9\+\s]*$")]],
    ABN: ['', [Validators.required, Validators.pattern("^[0-9\s]*$")]],
    gst: [false, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private organisationService: OrganisationService
  ) {

  }
  ngOnInit(): void {
    this.getOrgSettings();
  }

  async getOrgSettings() {
    let orgSettings:any = await this.organisationService.getOrganisation();
    console.log(orgSettings);

    this.companySettingsForm.patchValue({
      name: orgSettings.name,
      email: orgSettings.email,
      number: orgSettings.number,
      ABN: orgSettings.ABN,
      gst: orgSettings.gst ? orgSettings.gst : false,
    });

  }

  async save() {
    console.log(this.companySettingsForm.value);

    if (this.companySettingsForm.invalid) {
      return;
    }

    await this.organisationService.updateOrganisation(this.companySettingsForm.value);
  }



}
