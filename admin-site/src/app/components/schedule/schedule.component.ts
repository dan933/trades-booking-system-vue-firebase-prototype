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


export interface scheduleDescription {
  name: string;
}


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule
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
    private scheduleService: ScheduleService
  ) {
  }

  ngOnInit() {
    this.updateTable();
  }

  async updateTable() {
    //get the schedule from the schedule service
    let schedule = await this.scheduleService.getSchedule()

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
}
