import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerF: FormGroup;

  constructor(private authService: AuthService) {

    this.registerF = new FormGroup({
      name: new FormControl('', [Validators .required,Validators.minLength(6)]),
      email: new FormControl('',[Validators.required,Validators.email]),
      fullname: new FormControl('',[Validators.required,this.fullNameValidator]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(6),
      ]),
      rePassword: new FormControl('', Validators.required),
      admin: new FormControl(false)

    });

    this.registerF.setValidators(this.passwordMatchValidator());
  }


  ngOnInit() {
  }

  fullNameValidator(control: any) {
    const forbiddenWords = ['ma túy', 'hàng trắng'];
    if (forbiddenWords.some(word => control.value.toLowerCase().includes(word))) {
      return { forbiddenWords: true };
    }
    return null;
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('rePassword')?.value;

      if (password !== confirmPassword) {
        return { mismatch: true };
      } else {
        return null;
      }
    };
  }

  onRegister(): void {
    if(this.registerF.invalid){
      alert('Vui lòng nhập hợp lệ')
      return console.log('Không hợp lệ');
    }
    const formData = this.registerF.value;
    formData.admin = false;
    this.authService.register(this.registerF.value).subscribe(
      (res:any)=>{
        console.log(res);
        alert('Đăng kí thành công')
        location.assign('/login');

      },
      (error:any)=>{
        console.error(error);
      }
    );
  }
}
