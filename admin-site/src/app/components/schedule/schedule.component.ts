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
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleDetailsComponent } from './dialog-schedule-details/dialog-schedule-details.component';


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
    'endTime',
    'status'
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
    public dialog: MatDialog
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

  openDialog(schedule: any) {

    let dialogData = this.generateDialogData(schedule);

    this.dialog.open(DialogScheduleDetailsComponent, {
      width: '350px',
      maxHeight: '100vh',
      data: { dialogData, schedule }
    });
  }

  ngAfterViewInit() {
  }

  //used for schedule details dialog
  //generates the services table data
  generateDialogData(schedule: any) {
    let services = schedule.services;

    let grandTotal = 0;
    let servicesTableData = services.map((service: any) => {
      let total = service.hours * service.selection.rate;

      grandTotal += total;

      return {
        serviceName: service.selection.name,
        hours: service.hours,
        rate: service.selection.rate,
        total: total
      }
    });

    return {servicesTableData, grandTotal};
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const accumulativeString = data.customerName + data.bookingDateString + data.startTime + data.endTime + data.status;
      return accumulativeString.toLowerCase().includes(filter.trim().toLowerCase());
    };

    this.dataSource.filter = filterValue;

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
