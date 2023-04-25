import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-expansion-panel',
  templateUrl: './custom-expansion-panel.component.html',
  styleUrls: ['./custom-expansion-panel.component.scss'],
})
export class CustomExpansionPanelComponent {
  @Input() expanded: boolean = true;
  @Input() title: string = '';
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columnSchema: any[];
  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() contentType: string = 'table';
  @Input() cardLeftPanel: any;
  @Input() cardRightPanel: any;
  @Input() pdfSrc: string;
  @Input() buttonName: string;
  @Input() selected: { key: string; value: any };
  @Output() action = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();

  public originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };
}
