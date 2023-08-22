import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  ide:string;
  expense:any[] = [];
  docData: { [key: string]: any } = {};
  expenseData!:Observable<any>;
  dataAdded:boolean=false;

  constructor() { }

  addData(ad:any) {
    const user = firebase.auth().currentUser;
    this.expense = [];
    if (user) {
      const userId = user.uid;

      firebase.firestore().collection('users').doc(userId).collection('expense').add(ad.value)
        .then((docRef) => {
          console.log('Data created successfully! Document ID:', docRef.id);
          ad.reset();
          this.readData();
        })
        .catch((error) => {
          console.error('Error creating data:', error);
        });
    }
  }

  readData() {
    const user = firebase.auth().currentUser;
    this.expense=[];
    if (user) {
      const userId = user.uid;

      firebase.firestore().collection('users').doc(userId).collection('expense').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.docData={...doc.data()};
            this.docData.docId=doc.id;
            this.expense.push(this.docData);
          });
          this.expenseData=of(this.expense);
          if (this.expense.length>0){
            this.dataAdded=true;
          }
          console.log(this.expenseData);
        })
        .catch((error) => {
          console.error('Error reading data:', error);
        });
    }
  }
 
  updateData(ed:any) {
    const user = firebase.auth().currentUser;
    this.expense = [];
    if (user) {
      const userId = user.uid;
      const documentId = this.ide; 
      console.log(this.ide);
      const updatedData = { 
        date: ed.value.date,
        category: ed.value.category,
        sub_category: ed.value.sub_category,
        amount: ed.value.amount
      };

      firebase.firestore().collection('users').doc(userId).collection('expense').doc(documentId).update(updatedData)
        .then(() => {
          console.log('Data updated successfully!');
          ed.reset();
          this.readData();
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    }
  }

  deleteData(did:string) {
    const user = firebase.auth().currentUser;
    this.expense = [];
    if (user) {
      const userId = user.uid;
      const documentId = did ; 

      firebase.firestore().collection('users').doc(userId).collection('expense').doc(documentId).delete()
        .then(() => {
          console.log('Data deleted successfully!');
          this.readData();
        })
        .catch((error) => {
          console.error('Error deleting data:', error);
        });
    }
  }

  editDataId(ide:string){
    this.ide=ide;
  }

}
