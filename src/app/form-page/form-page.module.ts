import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPagePageRoutingModule } from './form-page-routing.module';

import { FormPagePage } from './form-page.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { PortService } from '../services/port.service';
// import {InputRowComponent} from './input-row/input-row.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPagePageRoutingModule,
    IonicSelectableModule

  ],
  declarations: [FormPagePage,
    // InputRowComponent
  ],
  providers: [PortService],
  // exports: [
  //   InputRowComponent
  // ]
})
export class FormPagePageModule {}
