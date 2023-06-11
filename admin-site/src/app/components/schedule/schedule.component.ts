import {Component, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScheduleService } from '../../services/schedule/schedule.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export interface scheduleDescription {
  name: string;
}


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ScheduleComponent {

  scheduleDate = new FormControl(moment());

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date> | undefined;

  displayedColumns: string[] = [
    'customerName',
    'bookingDateString',
    'startTime',
    'endTime'
    ];

  headers:any = {
    id: 'ID',
    customerName: 'Customer Name',
    startTime: 'Start Time',
    endTime: 'End Time',
    bookingDateString: 'Booking Date'
  }
  columnsToDisplayWithExpand  = [...this.displayedColumns, 'expand'];
  dataSource!: MatTableDataSource<any>;
  expandedElement: any;


  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private scheduleService: ScheduleService,
  ) {
  }

  ngOnInit() {
    this.updateTable();
  }

  async updateTable() {
    let selectedDate = this.scheduleDate.value?.toDate();
    console.log(selectedDate);
    //get the schedule from the schedule service
    let schedule = await this.scheduleService.getSchedule(selectedDate)

    this.dataSource = new MatTableDataSource(schedule);
    this.dataSource.sort = this.sort;

  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getScheduleAllDates(event: any) {
    let isChecked = event.checked;

    if (isChecked) {
      this.scheduleDate.setValue(null);
      console.log(this.scheduleDate.value);
      let schedule = await this.scheduleService.getSchedule()
      this.dataSource = new MatTableDataSource(schedule);
      this.dataSource.sort = this.sort;

    } else {
      this.scheduleDate.setValue(moment());
      console.log(this.scheduleDate.value);
      this.updateTable();

    }


  }

  async getScheduleDate() {
    this.updateTable();
  }
}
