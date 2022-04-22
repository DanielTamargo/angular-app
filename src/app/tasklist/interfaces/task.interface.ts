export interface TaskInterface {
  activity: string,
  type: TaskType,
  price: number,
  participants: number,
  completed: boolean, // <- por defecto false
  created_at: number,

  key: string, // <- random
  link?: string, // <- omitible
  accessibility?: number, // <- omitible
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
