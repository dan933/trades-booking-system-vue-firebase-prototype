import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private auth: Auth = inject(Auth);
  hide = true;

  constructor() {
    console.log(this.auth);

  }

}
