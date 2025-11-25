import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [
    // exemplo: ButtonComponent, CapitalizePipe
  ],
  exports: [
    CommonModule,
    // ButtonComponent, CapitalizePipe
  ]
})
export class SharedModule {}
