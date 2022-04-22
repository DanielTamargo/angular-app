import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { TaskInterface } from '../interfaces/task.interface';
import { TaskListStateInterface } from '../interfaces/tasklist-state.interface';
import { TasklistService } from '../services/tasklist.service';
import { TaskListConstants as TLC } from '../constants/tasklist-constants';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  formTask: FormGroup;
  initialFormValue = null;
  types: String[] = [ 'recreational', 'music', 'education', 'cooking', 'social', 'diy', 'charity', 'relaxation', 'busywork' ];
  storeSubscription$ = new Subscription;
  task?: TaskInterface = null;

  constructor(private taskListService: TasklistService, private store: Store<{ taskList: TaskListStateInterface }>) { }

  ngOnInit(): void {
    // Inicializamos un form para nueva tarea, aunque este paso no debería ser relevante pero sí útil para evitar posibles bugs
    this.setFormControls(null);

    // Nos suscribimos al reducer de las tareas para obtener el estado cada vez que haya un cambio
    this.storeSubscription$ = this.store.select('taskList').subscribe(state => {
      console.log('Form',state);
      
      if (!state.taskFormShow) return;

      if (state.taskToUpdate) this.setFormControls(state.tasks.find(t => t.key == state.taskToUpdate));
      else this.setFormControls();

      this.taskListService.displayComponents(TLC.DISPLAY_FORM);
    });  
  }

  /**
   * Configura el formulario con los datos de la tarea recibida
   */
  setFormControls(task: TaskInterface = null): void {
    if (task) this.task = task;
    else this.task = null;

    // Inicializamos el formulario (importante hacerlo antes de que se renderice)
    this.formTask = new FormGroup({
      // Grupo con la información principal
      'mainInfo': new FormGroup({
        'activity': new FormControl(
          task ? task.activity : null,
          [Validators.required, this.customTextValidator.bind(this)]
        ),
        'type': new FormControl(
          task ? task.type : null,
          [Validators.required]
        ),
        'price': new FormControl(
          task ? task.price : null,
          [Validators.required, this.customNumberValidator.bind(this)]
        ),
        'participants': new FormControl(
          task ? task.participants : null,
          [Validators.required, this.customNumberValidator.bind(this)]
        ),
      }),

      // Grupo con información adicional no vital
      'additionalInfo': new FormGroup({
        // 'accesibility': new FormControl(task ? task.accessibility : null),
        'link': new FormControl(task ? task.link : null,
          [this.customURLValidator.bind(this)]),
      })
    });

    this.initialFormValue = this.formTask.value;
  }

  /**
   * Validador personalizado para comprobar los inputs tipo texto
   * 
   * @param control input a validar
   * @returns null si la validación es OK, clave: boolean si surge algún error
   */
  customTextValidator(control: FormControl): { [key: string]: boolean } {
    // Obtenemos el valor
    const value = String(control.value);
  
    // Si algo falla, devolvemos el error como true
    if (value.length < 3 ) return { invalidMinLength: true };
    if (value.length > 255 ) return { invalidMaxLength: true };
  
    // Si todo ha ido bien, simplemente no devolvemos nada para que lo considere OK
    return null;
  }

  /**
   * Validador personalizado para comprobar los inputs tipo número
   * 
   * @param control input a validar
   * @returns null si la validación es OK, clave: boolean si surge algún error
   */
  customNumberValidator(control: FormControl): { [key: string]: boolean } {
    // Obtenemos el valor
    const value = control.value;
    
    // Si algo falla, devolvemos el error como true
    if (isNaN(value)) return { notANumber: true };
    if (+value < 0) return { negativeNumber: true };
  
    // Si todo ha ido bien, simplemente no devolvemos nada para que lo considere OK
    return null;
  }


  customURLValidator(control: FormControl): { [key: string]: boolean } {
    // Es opcional 
    if (!control.value) return null;

    // Obtenemos el valor
    const value = String(control.value).trim();

    // Si algo falla, devolvemos el error como true
    try {
      new URL(value);
    } catch (_) {
      return { invalidURL: true };  
    }

    // Si todo ha ido bien, simplemente no devolvemos nada para que lo considere OK
    return null;
  }
 

  /**
   * Genera una serie de tramos de una determinada longitud y los une para devolver una clave aleatoria
   * 
   * @param partLength longitud de cada tramo
   * @param partsNumber número de tramos
   * @returns clave aleatoria generada en base a los tramos configurados (unidos por un guión)
   */
  randomKey(partLength: number = 5, partsNumber: number = 3): string {
    const result           = [];
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let part               = '';
    for (let partIndex = 0; partIndex < partsNumber; partIndex++) {
      for (var i = 0; i < partLength; i++ ) {
        part += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      result.push(part);
      part = '';
    }
    return result.join('-');
  }

  /**
   * Crea la tarea y la envía al servicio para que la registre y añada al listado de tareas
   */
  onSubmit(): void {
    // Generamos la tarea
    const task: TaskInterface = {
      ...this.formTask.value['mainInfo'],
      ...this.formTask.value['additionalInfo'],
      
      id: this.task ? this.task.id : null,
      
      key: this.task ? this.task.key : this.randomKey(),
      completed: false,
      accessibility: this.task ? this.task.accessibility : 0
    }

    // Si la tarea previamente almacenada es null, será una creación
    if (!this.task) {
      this.taskListService.addTask(task);
      return;
    }

    // Si no, será una actualización
    this.taskListService.updateTask(task);
  }

  /**
   * Método para volver atrás y cancelar el formulario, si detecta cambios mostrará una alerta para solicitar una confirmación
   * 
   * Simula el CanDeactivate, pero como no se mueve de ruta lo ejecutamos en el propio método
   */
  onGoBack(): void {
    if (this.formTask.touched && this.formTask.dirty) {
      // Si el usuario ha modificado el formulario, mostramos alerta para la confirmación
      Swal.fire({
        title: 'Ey!',
        text: 'Your changes will be lost. Do you want to leave?',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        // Si confirma, volvemos
        if (result.isConfirmed) this.taskListService.displayComponents(TLC.DISPLAY_INDEX);
      });
    } else {
      // Si no había modificado, directamente volvemos
      this.taskListService.displayComponents(TLC.DISPLAY_INDEX);
    }

  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de rendimiento y memoria
    this.storeSubscription$.unsubscribe();
  }

}
