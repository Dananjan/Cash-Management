import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore , AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class RegService{

  isLoading=false;
  userData: any; 
  userName: string;
  imageUrl:string;
  rememberMe = false;

  constructor(
    public afs: AngularFirestore, 
    public afAuth: AngularFireAuth,  
    public router: Router,
    public ngZone: NgZone,   
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

 
  SignIn(email: string, password: string) {
    this.isLoading=true;
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
            if (this.rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberMe');
            }
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
        this.isLoading=false;
      });
  }

 
  SignUp(email: string, password: string,fName:string,lName:string,event: any) {
    event.preventDefault();
    this.isLoading=true;
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userName= fName+" "+lName;
        this.SetUserData(result.user);
        this.UpdateProfileUName(this.userName);
        this.SendVerificationMail();
      })
      .catch((error) => {
        window.alert(error.message);
        this.isLoading=false;
      });
  }
 
  SendVerificationMail() {

    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
          this.router.navigate(['verify-email-address']);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, currentPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.updatePassword(newPassword)
          .then(() => {
            this.sendPasswordChangeNotification(user.email);
          });
      });
  }
 
  sendPasswordChangeNotification(email: string): void {
    this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password change notification email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending password change notification email:', error);
      });
  }
  
  
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['side-menu']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  
  /*SignUpUser(fname:string,lname:string){
   
    this.userName=fname+" "+lname;
    console.log(this.userName);
  }*/

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  
  async UpdateProfileUName(displayName: string) {
    const profile = {
        displayName: displayName
    }
    return (await this.afAuth.currentUser).updateProfile(profile);
  }

  async UpdateProfileImage(photoURL: string) {
    const profile = {
        photoURL: photoURL
    }
    return (await this.afAuth.currentUser).updateProfile(profile);
  }
  
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.isLoading=false;
      this.router.navigate(['register']);
    });
  }
  
}