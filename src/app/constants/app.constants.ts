import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConstants {
  public TOKEN_EXPIRY_DURATION = 15;
  public MEDICINES = {
    MEDICINE_1: 'JEMPERLI',
    MEDICINE_2: 'ZEJULA',
    MEDICINE_3: 'OJJAARA',
    ALL: 'All',
  };

  // public BAR_CHART_LABELS =  {
  //     first: "Intake",
  //     second: "Insurance Auth Required",
  //     third: "Financial ServiceIn Progress",
  //     fourth: "PAP In, Process",
  //     fifth: "Other",
  //     sixth: "Total",
  // }
  public BAR_CHART = {
    BAR_CHART_LABELS: [
      'Intake',
      'Insurance Auth Required',
      'Financial ServiceIn Progress',
      'PAP In Process',
      'Other',
      'Total',
    ],
    BAR_CHART_COLORS: [
      '#FF6633',
      '#924A98',
      '#E49B13',
      '#544F40',
      '#B3A99F',
      '#40488D',
    ],
  };
}
