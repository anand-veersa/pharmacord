import { Component, Input, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/constants/app.constants';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @Input() data: any[] = [];
  private barWidth: number = 80;
  public labelLength: number = 0;
  public options: any;
  public chartData: any;
  public chartValues: number[] = [];
  constructor(public appConstants: AppConstants) {}

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges() {
    this.buildChart();
  }

  private buildChart(): void {
    if (!this.data) {
      return;
    }
    let totalCases = 0;
    this.labelLength = this.appConstants.BAR_CHART.BAR_CHART_LABELS.length;
    this.chartValues = new Array(this.labelLength).fill(0);
    this.data.forEach((c: any) => {
      const index = this.appConstants.BAR_CHART.BAR_CHART_LABELS.findIndex(
        label => label === c.EnrollmentStatus
      );
      if (index < 0) return;
      this.chartValues[index]++;
      totalCases++;
    });
    this.chartValues[this.labelLength - 1] = totalCases;
    const stepSize = totalCases < 30 ? 3 : Math.ceil(totalCases / 10);

    const maxStep = Math.ceil(totalCases / stepSize) + 1;
    this.options = {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#ebedef',
          },
        },
        title: {
          display: true,
          text: 'My Patients',
          color: '#2F2F2F',
          font: {
            weight: '400',
            size: '18',
          },
        },
        datalabels: {
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          border: 'none',
          backgroundColor: 'teal',
          color: 'white',
          font: {
            weight: 'bold',
          },
        },
      },
      tooltips: {
        enabled: false,
      },
      hover: {
        mode: null,
      },
      legend: {
        display: false,
        labels: {
          fontColor: 'Red',
          fontSize: 25,
          Family: 'Raleway',
          border: 0,
        },
      },
      barThickness: this.barWidth,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Patients',
            color: '#2F2F2F',
            font: {
              size: '14',
              weight: '400',
            },
          },
          ticks: {
            stepSize: stepSize,
            beginAtZero: true,
            max: maxStep,
            min: 0,
            color: '#2F2F2F',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: true,
            beginAtZero: 0,
            color: '#000000',
            callback: (index: number) => {
              const labelName =
                this.appConstants.BAR_CHART.BAR_CHART_LABELS[index];
              if (/\s/.test(labelName)) {
                return labelName.split(' '); //check space for labelName break
              } else {
                return labelName;
              }
            },
          },
        },
      },
    };
    this.chartData = {
      labels: this.appConstants.BAR_CHART.BAR_CHART_LABELS,
      datasets: [
        {
          label: '',
          backgroundColor: this.appConstants.BAR_CHART.BAR_CHART_COLORS,
          borderColor: '#C1C8CB',
          data: this.chartValues,
        },
      ],
    };
  }

  getLegendStyle(index: number): {
    flexBasis: string;
    backgroundColor: string;
  } {
    return {
      flexBasis: `${100 / this.labelLength}%`,
      backgroundColor: this.appConstants.BAR_CHART.BAR_CHART_COLORS[index],
    };
  }
}
