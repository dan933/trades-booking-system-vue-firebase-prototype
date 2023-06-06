import { Injectable, inject } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  constructor() {
  }

  async getOrganisation() {
    let userToken = await this.auth.currentUser?.getIdTokenResult()
    let orgId = userToken?.claims['org'];

    if (!orgId) {
      return {
        error: "No organisation found",
        success: false
      }
    }

    //get the organisation from firestore
    let org = doc(this.firestore, `organisations/${orgId}`);
    let orgData = (await getDoc(org)).data();

    return orgData;

  }

  //get org settings
  async getOrganisationSettings() {
    let userToken = await this.auth.currentUser?.getIdTokenResult()
    let orgId = userToken?.claims['org'];

    //get the organisation from firestore
    let orgSettings = doc(this.firestore, `organisations/${orgId}/availability/opperatingHours`);
    let orgSettingsData = (await getDoc(orgSettings)).data();

    return orgSettingsData;
  }

  //format data for user

  //update org settings

  //add and update services
}
