import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {


  displayEdit="none";
  ide:string;
  income:any[] = [];
  docData: { [key: string]: any } = {};
  incomeData!:Observable<any>;
  dataAdded:boolean=false;
  addForm:any;
  editForm:any;
 
  constructor() {}

  addData(ad:any) {
    const user = firebase.auth().currentUser;
    this.income = [];
    if (user) {
      const userId = user.uid;

      firebase.firestore().collection('users').doc(userId).collection('income').add(ad.value)
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
    this.income = [];
    if (user) {
      const userId = user.uid;

      firebase.firestore().collection('users').doc(userId).collection('income').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.docData={...doc.data()};
            this.docData.docId=doc.id;
            this.income.push(this.docData);
          });
          this.incomeData=of(this.income);
          if (this.income.length>0){
            this.dataAdded=true;
          }
          console.log(this.incomeData);
          
        })
        .catch((error) => {
          console.error('Error reading data:', error);
        });
    }
  }
 
  updateData(ed:any) {
    const user = firebase.auth().currentUser;
    this.income = [];
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

      firebase.firestore().collection('users').doc(userId).collection('income').doc(documentId).update(updatedData)
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
    this.income = [];
    if (user) {
      const userId = user.uid;
      const documentId = did ; 
      firebase.firestore().collection('users').doc(userId).collection('income').doc(documentId).delete()
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
    this.displayEdit="block";
    this.ide=ide;
  }
 
}
