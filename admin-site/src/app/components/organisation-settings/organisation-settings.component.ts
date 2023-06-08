import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { IOpperatingHours, IOppeningTimeDay  } from 'src/app/models/IOpperatingHours';

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

  errorMessage: string = '';
  timeSpanForm: FormGroup = new FormGroup({});
  openingHoursForm: FormGroup = new FormGroup({});
  opperatingHoursData: IOpperatingHours = {} as IOpperatingHours;


  dayKeys = [0, 1, 2, 3, 4, 5, 6]
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
    this.updateForms();
  }

  async saveSettings(event: Event) {
    event.preventDefault();

    //check if forms are valid
    if (this.timeSpanForm.invalid || this.openingHoursForm.invalid) {
      this.errorMessage = 'Please correct Times';
      return;
    }

    this.errorMessage = '';

    console.log(this.timeSpanForm.value);
    console.log(this.openingHoursForm.value);

    //format data for firestore
    let response = await this.organisationService.updateOpperatingHours(this.timeSpanForm.value, this.openingHoursForm.value);
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

  //Get the opperating hours data from firestore
  async getOpperatingHours() {
    this.opperatingHoursData = await this.organisationService.getOrganisationSettings() as IOpperatingHours;
    console.log(this.opperatingHoursData);
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

  async createTimeSpanForm() {
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
          from: [this.timeOptions[0]], // set initial object instance
          to: [this.timeOptions[0]], // set initial object instance
        }, { validators: this.timeValidator() })
      }))
    });
  }

  //Create the forms
  createForms() {
    this.createTimeSpanForm();
    this.createOpeningHoursForm();
  }

  //If data doc in firestore exists update the form with the data
  async updateForms() {
    await this.getOpperatingHours();

    if (this.opperatingHoursData?.gapBetween && this.opperatingHoursData?.bookMonthsAheadLimit) {
      this.timeSpanForm.patchValue({
        gapBetweenAppointments: this.opperatingHoursData.gapBetween,
        bookMonthsAheadLimit: this.opperatingHoursData.bookMonthsAheadLimit
      });

    }

    if (this.opperatingHoursData?.openingTimes) {

      const openingTimesControl = this.openingHoursForm.get('openingTimes') as FormArray;

      Object.keys(this.opperatingHoursData.openingTimes).forEach((day: string, index: number) => {
        const dayFormGroup = openingTimesControl.at(index) as FormGroup;

        let currentDay = this.opperatingHoursData.openingTimes[+day];

        dayFormGroup.patchValue({
          checked: !!currentDay?.open,
          from: this.timeOptions.find(option => option.value === (currentDay?.start || 9)), // find the corresponding object instance
          to: this.timeOptions.find(option => option.value === (currentDay?.end || 16)), // find the corresponding object instance
        });
      });
    }

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

