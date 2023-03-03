import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-needed',
  templateUrl: './action-needed.component.html',
  styleUrls: ['./action-needed.component.scss'],
})
export class ActionNeededComponent {
  @Input() alerts: any[] = [];

  ngOnInit() {
    console.log(this.alerts);
  }
}
