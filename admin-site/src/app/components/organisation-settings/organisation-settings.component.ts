import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  }

  saveSettings(event: Event) {
    event.preventDefault();
  }

  timeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      let from = group.get('from')?.value;
      let to = group.get('to')?.value;
      let checked = group.get('checked')?.value;

      if(checked && (!from || !to)) {
        return { 'timeInvalid': true };
      }

      if(from.value >= to.value && checked) {
        return { 'timeInvalid': true };
      }

      return null;
    };
  }

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
        }, { validators: this.timeValidator() })  // add the validator here
      }))
    });
  }

  createForms() {
    this.createTimeSpanForm();
    this.createOpeningHoursForm();
  }

  convertToAMPM(time: any){
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
}
