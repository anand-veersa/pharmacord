import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AuthService } from 'src/app/auth/auth.service';

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
  @Input() buttonName: string;
  @Input() showBlueHeader: boolean = true;
  @Output() action = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private changeDetector: ChangeDetectorRef
  ) {}
  @Input() selected: { key: string; value: any };
  public selectedRow: number;

  public checkSelected(a: number, b: any): boolean {
    if (!this.selected) return false;
    return b[this.selected.key] === this.selected.value;
  }
  public onRowClicked(selectedRowIndex: number): void {
    this.selectedRow = selectedRowIndex;
  }

  public onAction(event: any): void {
    this.action.emit(event);
  }

  public btnClicked(element: any): void {
    this.buttonClicked.emit(element);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetector.detectChanges();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
