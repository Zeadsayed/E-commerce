import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slect',
  templateUrl: './slect.component.html',
  styleUrls: ['./slect.component.css']
})
export class SelectComponent implements OnInit {
  @Input() title:string = ""
  
  @Input() data:any[] = []

  @Output() selectedValue = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  detectChanges(event:any) {
    this.selectedValue.emit(event)
  }

}
