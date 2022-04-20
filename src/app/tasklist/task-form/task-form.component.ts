import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskInterface } from '../interfaces/task.interface';
import { TasklistService } from '../services/tasklist.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  formTarea: FormGroup;
  tarea: TaskInterface;

  types: String[] = [ 'recreational', 'music', 'education', 'cooking', 'social', 'diy', 'charity', 'relaxation', 'busywork' ];

  constructor(private taskListService: TasklistService) { }

  ngOnInit(): void {
    // Inicializamos el formulario (importante hacerlo antes de que se renderice)
    this.formTarea = new FormGroup({
      // Grupo con la información principal
      'mainInfo': new FormGroup({
        'activity': new FormControl(
          this.tarea ? this.tarea.activity : null,
          [Validators.required, this.customTextValidator.bind(this)]
        ),
        'type': new FormControl(
          this.tarea ? this.tarea.type : null,
          [Validators.required]
        ),
        'price': new FormControl(
          this.tarea ? this.tarea.price : null,
          [Validators.required, this.customNumberValidator.bind(this)]
        ),
        'participants': new FormControl(
          this.tarea ? this.tarea.participants : null,
          [Validators.required, this.customNumberValidator.bind(this)]
        ),
      }),

      // Grupo con información adicional no vital
      'additionalInfo': new FormGroup({
        'accesibility': new FormControl(this.tarea ? this.tarea.accessibility : null),
        'link': new FormControl(this.tarea ? this.tarea.link : null),
      })
    });
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

 

  onSubmit(): void {
    console.log('Submit');
    console.log(this.formTarea);
  }

  onGoBack(): void {
    this.taskListService.displayComponents(2);
  }

}
