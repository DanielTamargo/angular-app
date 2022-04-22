import { TaskInterface } from "../interfaces/task.interface";

export class TaskListConstants {
  /* ----------- UTIL ----------- */
  /* TASK TYPES */
  static readonly TASK_RECREATIONAL = 'recreational';
  static readonly TASK_MUSIC = 'music';
  static readonly TASK_EDUCATION = 'education';
  static readonly TASK_COOKING = 'cooking';
  static readonly TASK_SOCIAL = 'social';
  static readonly TASK_DIY = 'diy';
  static readonly TASK_CHARITY = 'charity';
  static readonly TASK_RELAXATION = 'relaxation';
  static readonly TASK_BUSYWORK = 'busywork';

  /* DISPLAY NUMBERS */
  static readonly DISPLAY_LOGIN = 1;
  static readonly DISPLAY_INDEX = 2;
  static readonly DISPLAY_FORM  = 3; // <- CREATE y UPDATE en uno
  static readonly DISPLAY_SHOW  = 4;

  /* API URLS */
  static readonly BORED_API_URL = "http://www.boredapi.com/api/activity/";

  /* --------- FUNCIONES --------- */
  /**
   * Ordena la lista de tareas más reciente a más antiguo
   * 
   * @param tasks lista de tareas
   * @returns lista ordenada
   */
  public static taskArraySortByTimestamp(tasks: TaskInterface[]): TaskInterface[] {
    return tasks.sort((a, z) => z.created_at - a.created_at);
  }
 }