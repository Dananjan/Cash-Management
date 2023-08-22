import { Component } from '@angular/core';
import { RegService } from 'src/app/authentication/register.service'; 


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent{
  
  userEmail: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword:string;
  UserPwdUpdate:boolean=false;

  constructor(private authService: RegService) {}

  changePassword(): void {
    this.UserPwdUpdate=true;
    this.authService.changePassword(this.userEmail, this.currentPassword, this.newPassword)
      .then(() => {
        console.log('Password changed successfully');
        this.UserPwdUpdate=false;
      })
      .catch((error) => {
        console.log('Error:', error);
        this.UserPwdUpdate=false;
      });
   
  }

}
