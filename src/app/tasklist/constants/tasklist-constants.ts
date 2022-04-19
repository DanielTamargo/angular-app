import { environment } from "src/environments/environment";

export class TaskListConstants {
  /* ----------- UTIL ----------- */
  /* TASK TYPES */
  static TASK_RECREATIONAL = 'recreational';
  static TASK_MUSIC = 'music';
  static TASK_EDUCATION = 'education';
  static TASK_COOKING = 'cooking';
  static TASK_SOCIAL = 'social';
  static TASK_DIY = 'diy';
  static TASK_CHARITY = 'charity';
  static TASK_RELAXATION = 'relaxation';
  static TASK_BUSYWORK = 'busywork';

  /* --------- FIREBASE --------- */
  static FIREBASE_URL = environment.firebaseConfig.databaseURL;

  /* ----- LOCAL STORAGE KEYS ----- */
  static LS_TASKLIST_SAVE = 'tasklist_save';

}