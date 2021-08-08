import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFormPageRoutingModule } from './add-form-routing.module';

import { AddFormPage } from './add-form.page';
import { PortService } from '../services/port.service';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFormPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [AddFormPage],
  providers: [PortService],
})
export class AddFormPageModule {}
