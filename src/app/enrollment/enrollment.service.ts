import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EnrollmentService {
  public selectedMedicine = new Subject<string>();
}
