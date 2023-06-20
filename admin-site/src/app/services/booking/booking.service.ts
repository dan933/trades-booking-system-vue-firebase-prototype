import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private auth: Auth = inject(Auth);

  constructor() { }

  async refundBooking(bookingId: string) {

    let token = await this.auth.currentUser?.getIdToken();


    let response = await fetch(`${environment.apiUrl}/refund-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookingId: bookingId
      })
    });

    return response.json();
  }

}
