import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements AfterViewInit {
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columnSchema: any[];
  @Input() displayedColumns: string[];
  @Input() pageSizeOptions: number[];
  @Input() pdfSrc: string;
  @Output() action = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onAction(event: any) {
    this.action.emit(event);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
