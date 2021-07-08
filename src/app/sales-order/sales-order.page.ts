import { Component, OnInit, Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.page.html',
  styleUrls: ['./sales-order.page.scss'],
})
export class SalesOrderPage implements OnInit {

  dataSales : any;
  ADate : any = moment().format("YYYY-MM-DD");
  BDate : any = moment().endOf('month').format("YYYY-MM-DD");
  // EndTime : any = moment(this.BDate, "DD-MM-YYYY").toDate();
  username : string;
  menu : string;
  api_url:string="https://project.graylite.com/anugrahsteel/";
  doc_no: string='';
  // flow_state: string;
  browser_data: any;
  data : any = [];


  constructor(
    private zone: NgZone, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private formBuilder: FormBuilder, 
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async filterSearch(){
    await this.storage.get('username').then((val) => {
      this.username = val
    });
    this.menu = "SO";

    
    // this.getCompany(this.email);
    var formData : FormData = new FormData();
    formData.set('doc_no',this.doc_no);
    formData.set('username',this.username);
    formData.set('ADate',this.ADate);
    formData.set('BDate',this.BDate);
    formData.set('menu',this.menu);
    this.http.post(this.api_url+'browser.php',formData)
    .subscribe((response) => {
      console.log(response)
      if(response['message']=='error'){
        this.presentToast(response['message']);
      } else { 
        this.browser_data = response;
        this.data = this.browser_data.data;
        console.log(response);
        console.log(this.ADate);
        console.log(this.BDate);
        // console.log(this.EndTime);
        console.log(this.username);
        console.log(this.browser_data);
        console.log(this.data);
        // console.log(this.name);
      }
    });
  }

  backPage(){
    this.router.navigateByUrl('/home-page');
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.filterSearch();
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
