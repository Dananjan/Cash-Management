import { Component } from '@angular/core';
import { RegService} from './register.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  public showPwd: boolean=false;

  firstName="";
  lastName="";

  
  constructor(public regService: RegService) { }

  ngOnInit() {
    const rememberMeValue = localStorage.getItem('rememberMe');
    this.regService.rememberMe = rememberMeValue === 'true';
  }

}

  
    

   
    
    
    
   


  



