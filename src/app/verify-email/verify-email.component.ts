import { Component,OnInit } from '@angular/core';
import { RegService } from '../authentication/register.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  constructor(public regService: RegService) { }
  
  ngOnInit() {
  }
}
