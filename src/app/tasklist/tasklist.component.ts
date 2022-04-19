import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {
  loading = true;
  user: any = null;

  // TODO refactorizar a servicio
  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe((user) => {
      this.loading = false;
      this.user = user;
      // console.log(user);
    });
  }

  userSignOut() {
    return this.afAuth.signOut().then(() => {
      console.log('Logout');
    });
  }

  ngOnInit(): void {
  }

}
