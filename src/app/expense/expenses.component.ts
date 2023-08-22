import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ExpenseService } from '../services/expense.service';



@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {

  displayedColumns: string[] = ['date', 'category', 'sub_category', 'amount'];
  ediData=false;
  editForm=false;
  delData=false;
  display="none";
  displayEdit="none";
 
 

  constructor(public expenseService:ExpenseService) {
    this.expenseService.readData();
  }

  edit(){
    this.ediData=!this.ediData;
    this.closeForm();
  }

  editData(ide:string){
    this.displayEdit="block";
    this.expenseService.editDataId(ide);
  }

  delete(){
    this.delData=!this.delData;
  }

  closeForm(){
    this.display="none";
    this.displayEdit="none";
  }

  openAddForm(){
    this.displayEdit="none";
    if (this.display=="none"){
      this.display="block";
    } else {
      this.display="none";
    }
  }
  
}























