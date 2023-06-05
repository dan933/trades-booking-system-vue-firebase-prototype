import { Component, OnInit } from '@angular/core';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss']
})
export class OrganisationSettingsComponent implements OnInit {

  constructor(
    private organisationService: OrganisationService
  ) {

  }
  ngOnInit(): void {
    this.getOrganisation();
  }

  async getOrganisation() {
    let test = await this.organisationService.getOrganisation();
    console.log(test);
  }
}
