import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-schedule-details',
  templateUrl: './dialog-schedule-details.component.html',
  styleUrls: ['./dialog-schedule-details.component.scss']
})
export class DialogScheduleDetailsComponent {
  viewType: string = 'overview';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogScheduleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  refund() {
    //start loading
    //api call here
    console.log("data", this.data.schedule.id)
    this.loading = true;
    setTimeout(() => {
      console.log("refund")
      //stop loading
      this.loading = false;

    }, 5000);

    // this.dialogRef.close();

  }

}
