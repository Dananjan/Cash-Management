import { Injectable } from '@angular/core';
import { Income, Expense} from './data';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatTableDataSource } from '@angular/material/table';


@Injectable()
export class DashboardService{
    incomes:Observable<Income[]>;
    expenses:Observable<Expense[]>;
    income:any[] = [];
    expense:any[] = [];
    docData: { [key: string]: any } = {};
    dataAddedIncome:boolean=false;
    dataAddedExpense:boolean=false;
    selectedStartDate: any
    selectedEndDate: any;
    selectedCategory: any;
    selectedSubCategory: any;
    selectedStartDateExpense: any;
    selectedEndDateExpense: any;
    selectedExpenseCategory: any;
    selectedExpenseSubCategory: any;
    


    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
      this.incomes = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            const userId = user.uid;
            return this.afs.collection('users').doc(userId).collection('income').valueChanges();
          } else {
            return [];
          }
        })
      );
    
      this.expenses = this.afAuth.authState.pipe(
        switchMap(user => {
          user = firebase.auth().currentUser;
          if (user) {
            const userId = user.uid;
            return this.afs.collection('users').doc(userId).collection('expense').valueChanges();
          } else {
            return [];
          }
        })
      );
    }

    getincome(){
      return this.incomes;
    }

    getexpense(){
      return this.expenses;
    }

    
    getIncomeDataSource(): Observable<MatTableDataSource<any>> {
      return new Observable<MatTableDataSource<any>>((observer) => {
        const user = firebase.auth().currentUser;
        this.income= [];
    
        if (user) {
          const userId = user.uid;
    
          firebase.firestore().collection('users').doc(userId).collection('income').get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.docData = { ...doc.data() };
                this.docData.docId = doc.id;
                this.income.push(this.docData);
              });
              //this.incomeData=of(this.income);
              let filteredData = this.income;
            
              if (this.selectedStartDate && this.selectedEndDate) {
                filteredData = filteredData.filter((item) => {
                  const itemDate = new Date(item.date);
                  return itemDate >= this.selectedStartDate && itemDate <= this.selectedEndDate;
                });
              }

              if (this.selectedCategory) {
                filteredData = filteredData.filter((item) => item.category === this.selectedCategory);
              }

              if (this.selectedSubCategory) {
                filteredData = filteredData.filter((item) => item.sub_category === this.selectedSubCategory);
              } 
              if (this.income.length>0){
                this.dataAddedIncome=true;
              }
              const dataSourceIncome = new MatTableDataSource(filteredData);
              observer.next(dataSourceIncome);
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        }
      });
    }


    getExpenseDataSource(): Observable<MatTableDataSource<any>> {
      return new Observable<MatTableDataSource<any>>((observer) => {
        const user = firebase.auth().currentUser;
        this.expense= [];
    
        if (user) {
          const userId = user.uid;
    
          firebase.firestore().collection('users').doc(userId).collection('expense').get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.docData = { ...doc.data() };
                this.docData.docId = doc.id;
                this.expense.push(this.docData);
              });
              //this.expenseData=of(this.expense);
              let filteredExpenseData = this.expense; 
              if (this.selectedStartDateExpense && this.selectedEndDateExpense) {
                filteredExpenseData = filteredExpenseData.filter((item) => {
                  const itemDate = new Date(item.date);
                  return itemDate >= this.selectedStartDateExpense && itemDate <= this.selectedEndDateExpense;
                });
              }

              if (this.selectedExpenseCategory) {
                filteredExpenseData = filteredExpenseData.filter((item) => item.category === this.selectedExpenseCategory);
              }

              if (this.selectedExpenseSubCategory) {
                filteredExpenseData = filteredExpenseData.filter((item) => item.sub_category === this.selectedExpenseSubCategory);
              } 
              if (this.expense.length>0){
                this.dataAddedExpense=true;
              }
              const dataSourceExpense = new MatTableDataSource(filteredExpenseData);
              observer.next(dataSourceExpense);
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        }
      });
    }

}