export interface TaskListStateInterface {
  tasks: TaskInterface[];
  editedTask: string | null;
  newTask: string | null;
}

export interface TaskInterface {
  activity: string,
  type: TaskType,
  price: number,
  participants: number,
  completed: boolean,

  key: string,
  link?: string,
  accessibility: number,
  id?: string, // <- opcional porque al insertar una nueva recogerá su id en la respuesta
}

type TaskType =
  'recreational' |
  'music' |
  'education' |
  'cooking' |
  'social' |
  'diy' |
  'charity' |
  'relaxation' |
  'busywork';
