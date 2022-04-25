import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TasklistComponent } from './tasklist.component';
import { TaskIndexComponent } from './task-index/task-index.component';
import { TaskFormComponent } from './task-form/task-form.component';

// Firebase
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/compat/auth";
import { environment } from 'src/environments/environment';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    /*firebase.auth.GithubAuthProvider.PROVIDER_ID,*/
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
  ],
  // tosUrl: '<your-tos-link>',
  // privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
  imports: [
    SharedModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  declarations: [
    TasklistComponent,
    TaskIndexComponent,
    TaskFormComponent,
  ],
  exports: [
  ],
})
export class TaskListModule { }
