import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConstants {
  public TOKEN_EXPIRY_DURATION = 15;

  // public BAR_CHART_LABELS =  {
  //     first: "Intake",
  //     second: "Insurance Auth Required",
  //     third: "Financial ServiceIn Progress",
  //     fourth: "PAP In, Process",
  //     fifth: "Other",
  //     sixth: "Total",
  // }
  public BAR_CHART_LABELS = [
    'Intake',
    'Insurance Auth Required',
    'Financial ServiceIn Progress',
    'PAP In, Process',
    'Other',
    'Total',
  ];
}
