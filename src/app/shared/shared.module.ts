import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { SelectComponent } from './ui/select/select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SpinnerComponent, SelectComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [
    CommonModule,
    SpinnerComponent,
    RouterModule,
    FormsModule,
    SelectComponent,
  ],
})
export class SharedModule {}
