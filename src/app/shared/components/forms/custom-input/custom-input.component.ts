import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JsonFormControls } from 'src/app/models/json-form-data.model';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: JsonFormControls;
  @Input() fieldName: string;
  @Input() formType: string = '';
  @Input() inputPrefix: string;
  @Input() customErrorMsg: string;
  @Input() isCustomError: boolean;
  public errors: ValidationErrors | null | undefined;
  public files: any[] = [];
  public disableUploader: boolean = false;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.errors = this.form.get(this.field.name)?.errors;
  }

  public browseFile(event: Event, id: string): void {
    event.preventDefault();
    if (this.files.length === 2) return;
    document.getElementById(id)?.click();
  }

  public async setAttachDoc(event: Event) {
    if ((<HTMLInputElement>event.target)?.files![0].size > 10485760) {
      this.form.controls[this.field.name].setErrors({
        maxSizeExceeded: 10485760,
      });
    } else {
      //   const base64 = await this.sharedService.getBase64((<HTMLInputElement>event.target)!.files![0]);
      //   console.log(base64);
      // const obj = {
      //   base64: base64,
      //   name: (<HTMLInputElement>event.target).files![0].name,
      // };
      //   this.files.push(obj);
      //   this.form.get(this.field.name)?.setValue(this.files);
      //   (<HTMLInputElement>event.target).value = '';
      const reader = new FileReader();
      reader.readAsDataURL((<HTMLInputElement>event.target).files![0]);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.files.push({
          file: (<HTMLInputElement>event.target).files![0],
          base64: base64String,
        });
        this.form.get(this.field.name)?.setValue(this.files);

        // Clear the value of the file input element
        (<HTMLInputElement>event.target).value = '';
        // event.target.value = '';
      };
      console.log(this.files, this.files.length);
      // if(this.files.length === 1) this.disableUploader = true;
    }
  }
}
