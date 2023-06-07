import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, range, startWith } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

export interface opperationTime {
  value: number;
  label: string;
}

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss']
})
export class OrganisationSettingsComponent implements OnInit {

  timeSpanForm: FormGroup = new FormGroup({});
  openingHoursForm: FormGroup = new FormGroup({});
  filteredOptions: Observable<opperationTime[]>[] =[];

  dayKeys = [1, 2, 3, 4, 5, 6, 0]
  days:any = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  };

  timeKey = [...Array(24).keys()];

  timeOptions:opperationTime[] = this.timeKey.map((hour: number) => {
    return {
      value: hour,
      label: this.convertToAMPM(hour)
    }
  })

  get openingTimes(): FormArray {
    return this.openingHoursForm.get('openingTimes') as FormArray;
  }




  constructor(
    private organisationService: OrganisationService,
    private fb: FormBuilder
  ) {
  }
  ngOnInit(): void {
    this.createForms();

    this.openingTimes.controls.forEach((control: any, index: number) => {
      this.filteredOptions[index] = control.get('from').valueChanges.pipe(
        startWith(''),
        map((value:opperationTime) => {
          console.log("value", value)
          const name = typeof value === 'string' ? value : value?.label;
          return name ? this._filter(name as string) : this.timeOptions.slice();
        }),
      );
    });
  }

  saveSettings(event: Event) {
    event.preventDefault();

  }
  //Helper functions
  numericOnly(event: KeyboardEvent): boolean {
    const char = event.key;
    const regex = new RegExp('[0-9]', 'g');
    if (!char.match(regex)) {
      return false;
    }
    return true;
  }

  createTimeSpanForm() {
    this.timeSpanForm = this.fb.group({
      gapBetweenAppointments:['',[ Validators.required, Validators.min(1)]],
      bookMonthsAheadLimit:['',[ Validators.required, Validators.min(1)]],
    });
  }

  createOpeningHoursForm() {
    this.openingHoursForm = this.fb.group({
      openingTimes: this.fb.array(this.dayKeys.map((day: number) => {
        return this.fb.group({
          dayName: [this.days[day]],
          day: [day],
          checked: [false],
          from: [''],
          to: [''],
        })
      }))
    });
  }

  createForms() {
    this.createTimeSpanForm();
    this.createOpeningHoursForm();
  }

  // formatApiSettingsRequest() {

  //   let dayValues: any = {
  //     Sun: 0,
  //     Mon: 1,
  //     Tue: 2,
  //     Wed: 3,
  //     Thur: 4,
  //     Fri: 5,
  //     Sat: 6
  //   }

  //   let oppeningTimes = this.settingsForm.value.days.reduce((acc: any, current: any) => {
  //     let day = dayValues[current.name];

  //     acc[day] = {
  //       start: parseInt(current.from.split(':')[0]) || 9,
  //       end: parseInt(current.to.split(':')[0]) || 16,
  //       open: current.checked
  //     };

  //     return acc;
  //   }, {});

  //   return {
  //     oppeningTimes,
  //     bookMonthsAheadLimit: this.settingsForm.value.bookMonthsAheadLimit,
  //     gapBetweenAppointments: this.settingsForm.value.gapBetweenAppointments
  //   };

  // }

  convertToAMPM(time: any){
    console.log(time)
    if (time === 0 || time === 24) {
      return '12:00 AM';
    } else if (time < 12) {
      return time + ':00 AM';
    } else if (time === 12) {
      return '12:00 PM';
    } else {
      return (time - 12) + ':00 PM';
    }
  }

  displayTime(time: any) {
    return time ? time.label : '';
  }

  private _filter(name: string): any[] {

    const filterValue = name.toLowerCase();

    return this.timeOptions.filter(option => option.label.toLowerCase().includes(filterValue));
  }

}
