import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TasklistService } from './services/tasklist.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {
  loading = true;
  user: any = null;

  // TODO refactorizar a servicio
  constructor(
    public afAuth: AngularFireAuth,
    private taskListService: TasklistService
    ) 
  {
    // Nos suscribimos a los cambios en el usuario
    this.afAuth.user.subscribe((user) => {
      this.user = user;
      this.loading = false;
      this.taskListService.user = user;

      if (!user) {
        this.taskListService.userAccessToken = null;
        return; 
      }

      // Obtenemos el token: https://firebase.google.com/docs/reference/js/v8/firebase.User#getidtoken
      user.getIdToken().then(token => {
        this.taskListService.userAccessToken = token;
      });
    });

  }

  async userSignOut() {
    return this.afAuth.signOut().then(() => {
      console.log('Logout');
    });
  }

  ngOnInit(): void {
  }

}
