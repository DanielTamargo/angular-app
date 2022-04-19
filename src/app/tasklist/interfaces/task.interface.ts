export interface TaskListStoreInterface {
  tasks: TaskInterface[];
  editedTask: number;
  newTask: number;
}

export interface TaskInterface {
  activity: string,
  type: TaskType,
  price: number,
  participants: number,
  completed: boolean,

  link?: string,
  accessibility: number,
  key: string,
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