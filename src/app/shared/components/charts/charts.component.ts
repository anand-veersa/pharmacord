import { Component, Input } from '@angular/core';
import { AppConstants } from 'src/app/constants/app.constants';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  @Input() data = [];
  private chartValues: number[] = [];

  constructor(private appConstants: AppConstants) {}

  private buildChart(): void {
    if (!this.data) {
      return;
    }
    let totalCases = 0;
    this.chartValues.fill(0, this.appConstants.BAR_CHART_LABELS.length - 1);
    this.data.forEach((c: any) => {
      const index = this.appConstants.BAR_CHART_LABELS.findIndex(
        c.EnrollmentStatus
      );
      if (!index) return;
      this.chartValues[index]++;
      totalCases++;
    });
    const stepSize = totalCases < 30 ? 3 : Math.ceil(totalCases / 10);

    const maxStep = stepSize * (Math.ceil(totalCases / stepSize) + 1);
    this.optionsObject = {
      plugins: {
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
      title: {
        display: true,
        text: '% Total Percentage',
        position: 'center',
        fontSize: 14,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Number of Patients',
              fontColor: '#006176',
              fontSize: 14,
              fontStyle: 'bold',
            },
            gridLines: {
              display: true,
            },
            ticks: {
              display: true,
              stepSize: this.stepSizeChart,
              beginAtZero: true,
              max: maxStep,
              min: 0,
            },
          },
        ],
        xAxes: [
          {
            barThickness: this.barWidth,
            gridLines: {
              display: false,
            },
            ticks: {
              display: true,
              beginAtZero: 0,
              fontColor: '#006176',
              callback: function (label, index, labels) {
                if (/\s/.test(label)) {
                  return label.split(','); //check Comma for label break
                } else {
                  return label;
                }
              },
            },
          },
        ],
      },
    };
    this.claimStatusData = {
      labels: [
        'Intake',
        'Insurance Auth,Required',
        'Financial Service,In Progress',
        'PAP In, Process',
        'Other',
        'Total',
      ],
      datasets: [
        {
          label: '',
          backgroundColor: [
            '#97C0C7',
            '#77A7B2',
            '#588F9D',
            '#367889',
            '#006176',
            '#444F54',
          ],
          borderColor: '#C1C8CB',
          data: this.chartValues,
        },
      ],
    };
    const ctx = document.getElementById('myChart');
    // Chart.defaults.global.tooltipTemplate =  "<abc>";
    const scale = {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of Patients',
            fontColor: '#006176',
            fontSize: 14,
            fontStyle: 'bold',
          },
          gridLines: {
            display: true,
          },
          ticks: {
            fontSize: this.fontSizeChart,
            fontStyle: 'bold',
            display: true,
            stepSize: this.stepSizeChart,
            beginAtZero: true,
            max: maxStep,
            min: 0,
          },
        },
      ],
      xAxes: [
        {
          barThickness: this.barWidth,
          gridLines: {
            display: false,
          },
          ticks: {
            fontSize: this.fontSizeChart,
            display: true,
            beginAtZero: 0,
            fontColor: '#006176',
            callback: function (value: string, index, ticks) {
              let v = value.split(' ');
              for (let index = 0; index < v.length; index++) {
                const element = v[index];
                if (element == 'In') {
                  v[index - 1] = v[index - 1] + ' In';
                  v[index] = v[index + 1];
                  v = v.slice(0, index + 1);
                  break;
                }
              }
              return v;
            },
          },
        },
      ],
    };
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Intake',
          'Insurance Auth Required',
          'Financial Service In Process',
          'PAP In Progress',
          'Other',
          'Total',
        ],
        datasets: [
          {
            label: '',
            backgroundColor: [
              '#97C0C7',
              '#77A7B2',
              '#588F9D',
              '#367889',
              '#006176',
              '#444F54',
            ],
            borderColor: '#C1C8CB',
            data: this.chartValues,
          },
        ],
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        // datasets: [{
        //       label: '# of Votes',
        //       data: [12, 19, 3, 5, 2, 3],
        //       borderWidth: 1
        //     }]
      },
      // tooltipTemplate: "<%= value %> Files",
      options: {
        scales: scale,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          template: 'demo',
          // titleColor: "green",
          // bodyColor: "red",
          // backgroundColor: "white",
          // footerColor: "green",
        },
        hover: {
          mode: null,
        },
        // responsive: true,
      },
      plugins: {
        afterDatasetsDraw: function (context, easing) {
          const ctx = context.chart.ctx;
          context.data.datasets.forEach(function (dataset) {
            for (let i = 0; i < dataset.data.length; i++) {
              if (dataset.data[i] != 0) {
                const model =
                  dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                let count = 0;
                let data = dataset.data[i];
                while (data > 0) {
                  data = Math.floor(data / 10);
                  count++;
                }
                data = dataset.data[i];
                if (dataset.data[i] > 1000) {
                  data = dataset.data[i] / 1000;
                  console.log(dataset.data[i], (dataset.data[i] % 1000) / 100);
                  if (
                    dataset.data[i] % 1000 == 0 ||
                    (dataset.data[i] % 1000) / 100 == 0
                  ) {
                    data = data + 'K';
                    count = count - 2.25;
                  } else {
                    data =
                      Math.floor(data) +
                      '.' +
                      (dataset.data[i] % 1000) / 100 +
                      'K';
                    count = count - 1;
                  }
                }
                const textY = model.y + (dataset.type == 'line' ? -3 : 15);
                const textX = model.x;
                ctx.font = Chart.helpers.fontString(
                  8,
                  'normal',
                  Chart.defaults.global.defaultFontFamily
                );
                // ctx.textAlign = 'middle';
                // ctx.textBaseline = 'middle';
                ctx.fillStyle = dataset.type == 'line' ? 'black' : 'black';
                ctx.save();
                ctx.translate(textX - 2 - (count - 1) * 3, textY - 17);
                ctx.fillText(data, 0, 0);
                ctx.restore();
              }
            }
          });
        },
      },
    });
  }
}
