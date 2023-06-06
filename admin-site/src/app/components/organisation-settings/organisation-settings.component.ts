import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss']
})
export class OrganisationSettingsComponent implements OnInit {

  settingsForm: FormGroup = new FormGroup({});
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];


  constructor(
    private organisationService: OrganisationService,
    private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.createSettingsForm();
  }

  get daysFormArray(): FormArray {
    return this.settingsForm.get('days') as FormArray;
  }

  getDayFormGroup(index: number): FormGroup {
    return this.daysFormArray.controls[index] as FormGroup;
  }

  async createSettingsForm() {
    this.settingsForm = this.fb.group({
      gapBetweenAppointments: ['', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])],
      bookMonthsAheadLimit: ['', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])],
      days: this.fb.array(this.daysOfWeek.map(day => this.fb.group({
        name: day,
        checked: [false],
        from: [''],
        to: ['']
      }, { validators: this.timeValidator })))
    });

    let settings = await this.organisationService.getOrganisationSettings();
    console.log(settings, "settings");
  }

  async getOrganisation() {
  }

  saveSettings(event: Event) {
    event.preventDefault();

    console.log("settingsForm", this.settingsForm.valid)

    let { oppeningTimes, bookMonthsAheadLimit, gapBetweenAppointments } = this.formatSettingsData()

    console.log("test", oppeningTimes, bookMonthsAheadLimit, gapBetweenAppointments);

  }
  formatSettingsData() {

    let dayValues: any = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thur: 4,
      Fri: 5,
      Sat: 6
    }

    let oppeningTimes = this.settingsForm.value.days.reduce((acc: any, current: any) => {
      let day = dayValues[current.name];

      acc[day] = {
        start: parseInt(current.from.split(':')[0]) || 9,
        end: parseInt(current.to.split(':')[0]) || 16,
        open: current.checked
      };

      return acc;
    }, {});

    return {
      oppeningTimes,
      bookMonthsAheadLimit: this.settingsForm.value.bookMonthsAheadLimit,
      gapBetweenAppointments: this.settingsForm.value.gapBetweenAppointments
    };

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
  forceHourFormat(event: any): void {
    const value = event.target.value;
    if (value.includes(':')) {
        event.target.value = value.split(':')[0] + ':00';
    }
  }

  timeValidator(control: AbstractControl): { [key: string]: any } | null {
    const checked = control.get('checked');
    const from = control.get('from');
    const to = control.get('to');

    // Convert the time strings to Date objects and compare
    const fromDate = new Date(`1970-01-01T${from?.value}:00`);
    const toDate = new Date(`1970-01-01T${to?.value}:00`);

    if (checked && checked.value) {
      // Check if either time is missing
      if (!from?.value || !to?.value) {
        return { 'invalidTime': true };
      }

      // Check if 'to' time is before 'from' time
      if (toDate < fromDate && checked && checked.value) {
        return { 'invalidTimeOrder': true };
      }
    }

    return null;
  }

  isInvalidTimeOrder(index: number): boolean {
    const group = this.getDayFormGroup(index);
    const checked = group.get('checked');
    const hasInvalidTimeOrder = group.hasError('invalidTimeOrder');
    console.log("checked", checked?.value, hasInvalidTimeOrder)

    return checked?.value && hasInvalidTimeOrder;
  }


}
