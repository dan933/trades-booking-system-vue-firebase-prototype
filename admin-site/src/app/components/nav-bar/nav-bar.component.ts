import { Component, OnDestroy, inject } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnDestroy {
  private auth: Auth = inject(Auth);
  idToken$ = idToken(this.auth);
  idTokenSubscription: Subscription;

  isUserLoggedIn: boolean = false;

  constructor() {
    this.idTokenSubscription = this.idToken$.subscribe((token: string | null) => {
      //handle idToken changes here. Note, that user will be null if there is no currently logged in user.
      if (token) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
      }
  })
   }

  ngOnDestroy(): void {
    this.idTokenSubscription.unsubscribe();
  }
}
