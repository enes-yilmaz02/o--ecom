import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { GeneratedCodeService } from 'src/app/services/generated-code.service';

@Component({
  selector: 'app-resetpassword-code',
  templateUrl: './resetpassword-code.component.html',
  styleUrls: ['./resetpassword-code.component.scss'],
})
export class ResetpasswordCodeComponent implements OnInit {
  userResetFormCode: FormGroup;
  generatedCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private generatedCodeService: GeneratedCodeService,
    private messageService:MessageService,
    private translocoService:TranslocoService,
    private router:Router
  ) {
    this.userResetFormCode = this.formBuilder.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.generatedCode = this.generatedCodeService.getGeneratedCode();

  }

  verifyCode() {
    if (this.userResetFormCode.valid) {
      const formValues = this.userResetFormCode.value;
      const code = formValues.code;
      const gcode = this.generatedCode;

      if (gcode === code) {
        this.messageService.add({
          severity:'success',
          summary:  this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate('rpc.messageDetailsuccess'),
        });
        this.router.navigate(['/password']);

      } else {
        this.messageService.add({
          severity:'success',
          summary:  this.translocoService.translate('errorMessage'),
          detail: this.translocoService.translate('rpc.messageDetailerror'),
        });
      }
    }
  }
}
