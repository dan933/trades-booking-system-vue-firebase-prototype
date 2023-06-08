
export interface IOppeningTimeDay {
  end: number;
  start: number | undefined;
  open: boolean | undefined;
}

export interface IOppeningTime {
  [index: string]: IOppeningTimeDay;
  [index: number]: IOppeningTimeDay;
}

export interface IOpperatingHours {
  bookMonthsAheadLimit: number;
  gapBetween: number;
  openingTimes: IOppeningTime;
}
