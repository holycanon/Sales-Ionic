import { Component, OnInit, Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {
  subscription;
  username:string;
  // email:string;
  // name:string; 
  // api_url:string="https://exam.nocortech.com/api/";
  constructor( 
    private alertCtrl: AlertController,
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private router: Router,) { }

  ngOnInit() {
    
  }

  async ionViewWillEnter(){
     await this.getUsername();
  }

  ionViewDidEnter(){
    // this.storage.clear()
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "HomePagePage"){
        if(window.confirm("Do you want to exit app?"))
        {
          navigator['app'].exitApp();
        }
      }      
   // console.log('backbutton: '+JSON.parse(JSON.stringify(e)));
    });    
  } 
  ionViewWillLeave(){
    // this.nav.pop();
    this.subscription.unsubscribe();
  } 

  async getUsername(){
    await this.storage.get('username').then((val) => {
      this.username = val
    });
    console.log(this.username);
  }

  salesOrder(){
    this.storage.set('menu','SO')
    this.router.navigateByUrl("/sales-order")
  }

  salesReturn(){
    this.storage.set('menu','SR')
    this.router.navigateByUrl("/sales-order")
  }


  // async getUserData(){
  //   await this.storage.get('email').then((val) => {
  //     this.email = val
  //   });
  //   // this.getCompany(this.email);
  //   var formData : FormData = new FormData();
  //   formData.set('email',this.email);
  //   this.http.post(this.api_url+'edit-profile',formData)
  //   .subscribe((response) => {
  //       this.name = response['data']['name'];
  //       console.log(this.name);
  //   });
  // }
  
  // my_profile() {
  //   this.route.navigate(['./edit-profile']);
  // }

  // goExam(){
  //   this.route.navigate(['./folder']);
  // }

  // attendace(){
  //   this.route.navigate(['./absensi']);
  // }

  // goCompany(){
  //   this.route.navigate(['./list-company']);
  // }

  LogOut(){
    this.storage.clear()
    .then(()=>
      this.router.navigateByUrl('/login')
    );
  }


}
