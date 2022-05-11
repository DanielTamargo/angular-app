import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-display-controls',
  templateUrl: './display-controls.component.html',
  styleUrls: ['./display-controls.component.scss']
})
export class DisplayControlsComponent implements OnInit {

  @Input() backText: string;
  @Input() nextText: string;
  @Input() nextDisplay: string;
  @Output() backClick = new EventEmitter<boolean>();
  @Output() nextClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }


  onBackClick(): void {
    this.backClick.emit(true);
  }

  onNextClick(): void {
    this.nextClick.emit(this.nextDisplay)
  }

}
