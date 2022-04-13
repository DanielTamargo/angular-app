import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-feature-info',
  templateUrl: './feature-info.component.html',
  styleUrls: ['./feature-info.component.scss']
})
export class FeatureInfoComponent implements OnInit {

  @Input() properties: {key: string, value: any}[];
  @Input() featureInfo: boolean = true;
  @Output() closeFeatureInfo = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }

  /**
   * Función ejecutada cuando cierre la ventana del componente feature info
   */
  onFeatureInfoClose() {
    this.closeFeatureInfo.emit(true);
  }

}
