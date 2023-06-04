import { Component, OnInit, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  private auth: Auth = inject(Auth);
  // public signIn: typeof signInWithEmailAndPassword = inject(signInWithEmailAndPassword);
  hide = true;
  loginForm: FormGroup = new FormGroup({});
  loading = false;


  constructor(
    public router: Router,
    private fb: FormBuilder
  ) {
    console.log(this.auth);

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  forgotPassword() {

  }

  login(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      this.loading = true;
      signInWithEmailAndPassword(this.auth, this.loginForm.value['email'], this.loginForm.value['password']).then((userCredential: any) => {

        console.log(this.loginForm.value['email'], this.loginForm.value['password'])
        //reset errors
        this.loginForm.setErrors(null);
        this.loading = false;

        //Navigate to home page
        this.router.navigate(['/schedule']);

      }).catch((error) => {
        console.log(error?.message, error?.code);
        if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
          this.loginForm.setErrors({ 'incorrect': true });
        } else {
          this.loginForm.setErrors({ 'failedAttempts': true });
        }
        this.loading = false;
      });
    }


  }
  toggleHide(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

}
