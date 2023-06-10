import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  constructor() { }

  async getSchedule() {
    let userToken = await this.auth.currentUser?.getIdTokenResult()
    let orgId = userToken?.claims['org'];

    if (!orgId) {
      return [];
    }

    //get the organisation from firestore
    let bookings = collection(this.firestore, `organisations/${orgId}/bookings`);

    let bookingsData = (await getDocs(bookings)).docs.map((doc: any) => {

      let bookingData = doc.data();

      return {
        id: doc.id,
        ...bookingData,
        customerName: `${bookingData.firstName} ${bookingData.lastName}`,
        startTime: this.convertTo12HourFormat(bookingData.startHour),
        endTime: this.convertTo12HourFormat(bookingData.endHour),
        bookingDateString:bookingData.bookingDate.toDate().toLocaleDateString()
      }
    });

    console.log(bookingsData, "bookingsData");

    return bookingsData;

  }

  convertTo12HourFormat(hour:number) {
    // Handle invalid input
    if (hour < 0 || hour > 24) {
        return 'Invalid hour input. Please input a number from 0 to 24.';
    }

    // Map the hour 0 and 24 to 12 (as they represent midnight)
    if (hour === 0 || hour === 24) {
        return '12:00 AM';
    }

    // Determine AM/PM
    let period = hour >= 12 ? 'PM' : 'AM';

    // Convert other hours to the 12-hour format
    if (hour > 12) {
        hour -= 12;
    }

    // Return the formatted time
    return `${hour}:00 ${period}`;
}



}
