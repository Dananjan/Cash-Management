import { Component, OnInit} from '@angular/core';
import { RegService } from './authentication/register.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public regService:RegService){}

  ngOnInit(): void {
      
  }
 
}
