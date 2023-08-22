import { Component,OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { DashboardService } from './dashboard.service';
import { Income, Expense } from './data';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit{

  dataSourceIncome: MatTableDataSource<any>;
  dataSourceExpense: MatTableDataSource<any>;
  displayedColumnsIncome: string[] = ['date', 'category', 'sub_category', 'amount'];
  displayedColumnsExpense: string[] = ['date', 'category', 'sub_category', 'amount'];
  @ViewChild(MatSort) sortI: MatSort;
  @ViewChild(MatSort) sortE: MatSort;
  
  incomes:Income[];
  expenses:Expense[];
  totIncome:number;
  totExpense:number;
  categoryExpense:Array<string>=[];
  amountExpense:Array<number>=[];
  amountIncome: any[];
  categoryIncome: any[];
  subcategoryIncome: any[];
  subcategoryExpense: any[];
  incomeFilter:boolean=false;
  expenseFilter: boolean=false;
  
  public pChart: any;
  public bChart: any;

  chartVisible:boolean=false;
   
  constructor(public dashboardService:DashboardService){}

  ngOnInit(): void {
    //this.dashboardService.getincomeData();
    this.dashboardService.getIncomeDataSource().subscribe(dataSourceIncome => {
      this.dataSourceIncome = dataSourceIncome;
      this.dataSourceIncome.sort = this.sortI;
    });
    //this.dashboardService.getexpenseData();
    this.dashboardService.getExpenseDataSource().subscribe(dataSourceExpense => {
      this.dataSourceExpense = dataSourceExpense;
      this.dataSourceExpense.sort = this.sortE;
    });
    this.dashboardService.getincome().subscribe( async incomes => {
      this.incomes=incomes;
      this.getTotalIncome();
      this.getIncome();
    });
    this.dashboardService.getexpense().subscribe( async expenses => {
      this.expenses=expenses;
      this.getTotalExpense();
      this.getExpense();
    });
     
  }

  getTotalIncome(){
    this.totIncome=0;
    for (var element of this.incomes){
      this.totIncome=this.totIncome+Number(element.amount);
    }
  }

  getTotalExpense(){
    this.totExpense=0;
    for (var element of this.expenses){
      this.totExpense=this.totExpense+Number(element.amount);
    }
    if (this.totExpense>0){
      this.chartVisible=true;
    }
  }

  async getIncome(){

    this.categoryIncome=[];
    this.subcategoryIncome=[];
    for (var element of this.incomes){
      this.categoryIncome.push(element.category);
      this.subcategoryIncome.push(element.sub_category);
    }
  }

  async getExpense(){
    this.amountExpense=[];
    this.categoryExpense=[];
    this.subcategoryExpense=[];
    for (var element of this.expenses){
      this.categoryExpense.push(element.category);
      this.subcategoryExpense.push(element.sub_category);
      this.amountExpense.push(Number(element.amount));
    }
    if (this.amountExpense.length>0){
      this.createPieChart();
      this.createBarChart();
    }
  }

  toggleIncomeCheck(){
    this.incomeFilter=!this.incomeFilter;
  }

  applyIncomeFilters(): void {
    this.ngOnInit()
  }

  toggleExpenseCheck(){
    this.expenseFilter=!this.expenseFilter;
  }

  applyExpenseFilters(): void {
    this.ngOnInit()
  }
  
  clearIncomeValues(){
    this.dashboardService.selectedStartDate="";
    this.dashboardService.selectedEndDate="";
    this.dashboardService.selectedCategory="";
    this.dashboardService.selectedSubCategory="";
  }

  clearExpenseValues(){
    this.dashboardService.selectedStartDateExpense="";
    this.dashboardService.selectedEndDateExpense="";
    this.dashboardService.selectedExpenseCategory="";
    this.dashboardService.selectedExpenseSubCategory="";
  }

  createPieChart(){
    this.pChart = new Chart("MyPieChart", {
      type: 'pie', 

      data: {
        labels: this.categoryExpense,
	        datasets: [{
            label: 'Amount($)',
            data: this.amountExpense,
            backgroundColor: [
              'red',
              'green',
              'orange',
              'blue',	
              'yellow'		
            ],
            hoverOffset: 4
          }],
      },
      options: {
        aspectRatio:4
      }
    });
  }

  createBarChart(){
  
    this.bChart = new Chart("MyBarChart", {
      type: 'bar', 

      data: {
        labels: this.categoryExpense, 
	       datasets: [
          {
            barThickness: 64,
            barPercentage: 1,
            label: "Amount($)",
            data: this.amountExpense,
            backgroundColor: [ 'red',
                              'green',
                              'orange',
                              'blue',
                              'yellow'
            ],
          }],
      },
      options: {
        aspectRatio:5
      } 
    });
  }
}


