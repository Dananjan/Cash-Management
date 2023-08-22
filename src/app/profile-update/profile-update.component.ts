import { Component, OnInit } from '@angular/core';
import { RegService } from 'src/app/authentication/register.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 


@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  userName:string;
  UserImageUpdate:boolean=false;
  
  constructor(public regService:RegService, private storage: AngularFireStorage, private firestore: AngularFirestore){}

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .doc(this.regService.userData.uid) 
      .valueChanges()
      .subscribe((user: any) => {
        this.photoURL = user.photoURL;
      });
  }
  
  onSubmit(fname:string,lname:string) {
    this.userName=fname+" "+lname;
    this.regService.UpdateProfileUName(this.userName);
  }

  selectedFile: File | null = null;
  photoURL: string | null = null;


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProfileImg(): void {
    if (!this.selectedFile) {
      return;
    }

    this.UserImageUpdate=true;

    const filePath = `profile/${Date.now()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.selectedFile);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.photoURL = url;
          const userDocRef = this.firestore.collection('users').doc(this.regService.userData.uid); 
          userDocRef.set({ photoURL: url }, { merge: true })
            .then(() => {
              console.log('Profile image URL updated successfully!');
              this.regService.UpdateProfileImage(this.photoURL);
              this.UserImageUpdate=false;
            })
            .catch((error) => {
              console.error('Error updating profile image URL:', error);
              this.UserImageUpdate=false;
            });
        });
      })
    ).subscribe();
  }

}

