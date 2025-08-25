import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnDestroy, OnInit {
  private auth: Auth = inject(Auth);
  idToken$ = idToken(this.auth);
  idTokenSubscription: Subscription;

  isUserLoggedIn: boolean = false;

  //get organisation name from firestore
  orgName: string = '';
  activeMenu: boolean = false;

  constructor(
    private organisationService: OrganisationService,
    private router: Router
  ) {
    this.idTokenSubscription = this.idToken$.subscribe(
      (token: string | null) => {
        //handle idToken changes here. Note, that user will be null if there is no currently logged in user.
        if (token) {
          this.isUserLoggedIn = true;
          //get organisation name
          this.getOrganisationName();
        } else {
          this.isUserLoggedIn = false;
        }
      }
    );
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.idTokenSubscription.unsubscribe();
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  getOrganisationName() {
    this.organisationService
      .getOrganisation()
      .then((orgName: Object | undefined) => {
        let { name } = orgName as any;
        this.orgName = name;
      });
  }

  async signOut() {
    await this.auth.signOut();
    this.toggleMenu();
    this.router.navigate(['/auth']);
  }
}
