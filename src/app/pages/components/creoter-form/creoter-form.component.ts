import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserRole } from 'src/app/models/role.enum';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-creoter-form',
  templateUrl: './creoter-form.component.html',
  styleUrls: ['./creoter-form.component.scss'],
})
export class CreoterFormComponent {

  creoterForm: FormGroup;

  userId: any;

  generatedCode:any;

  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService:MessageService,
    private router:Router

  ) {
    this.creoterForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      taxNumber: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      code:['',Validators.required]
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  onSubmit() {
     this.generatedCode = this.generateRandomCode();
    const body = {
      to: this.creoterForm.get('email').value,
      subject: 'email doğrulama',
      text: 'email doğrulama kodunuz: ' + this.generatedCode,
    };
    this.getUserId().subscribe((userId: any) => {
      this.userId = userId;
      this.userService.sendEmail(this.userId, body).subscribe(
        (response) => {
         this.senderMail.next(true);
         this.messageService.add({
          severity:'success',
          summary:'Başarılı!',
          detail:"E-posta adresinize gönderilen doğrulama kodu ile hesabınızı doğrulayabilirsiniz"
         })
        },
        (error) => {
          console.error('Error sending email', error);
        }
      );
    });
  }

  generateRandomCode(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  verifyCode(){
debugger
    const code = this.creoterForm.get('code').value;
     if(code===this.generatedCode){
      this.getUserId().subscribe(()=>{
        const formArray= this.creoterForm.value;
        delete formArray['code'];
        formArray.role = UserRole.Creator;
        this.userService.updateUser(this.userId,formArray).subscribe(()=>{
          this.messageService.add({
            severity:'success',
            summary:'Başarılı',
            detail:"Kullanıcı bilgileri güncellendi"
          });
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      })
     }
     else{
      alert('yanlış');
     }
  }
}
