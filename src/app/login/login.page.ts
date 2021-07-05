import { Component, OnInit, Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FormLogin:FormGroup;
  showPasswordText:any;
  api_url:string="https://project.graylite.com/anugrahsteel/";
  dataLogin:any;
  // playerID : string;
  subscription;
  // device_id :any;
  constructor(private zone: NgZone, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private router: Router,

    ) { }

  ngOnInit() {
    this.FormLogin=this.formBuilder.group({
      // server_name:['',Validators.required],
      username:['',Validators.required],
      password:['',Validators.required]
    });
  }

  ionViewDidEnter(){
    // this.storage.clear()
    // this.getUniqueDeviceID();
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "LoginPage"){
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

  async login(){

    var formData : FormData = new FormData();
    formData.set('username', this.FormLogin.value['username']);
    formData.set('password',this.FormLogin.value['password']);
    // formData.set('playerID',this.playerID);
    // formData.set('uid',this.device_id);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    // memanggil fungsi loginapi yang berada di service
    this.http.post(this.api_url+'login_check.php', formData)
    .subscribe((data) => {
      this.dataLogin=data;
      console.log(data);
      if(this.dataLogin.error==true){
        this.presentToast(this.dataLogin.message);
        console.log(this.dataLogin.message);
        
      }else{
        this.router.navigateByUrl("/home-page")
        this.presentToast(this.dataLogin.message);
        // console.log('username:'+this.dataLogin.data['username']);
        // this.storage.set('isLogin', 1)
        // this.storage.set('username', this.dataLogin.data['username'])
        
        // if(this.dataLogin.data['is_verifphonenumber'] == 1)
        // {
          
        // }
        // else{
        //   this.router.navigateByUrl("/verification")
        // }
            
      }
      loading.dismiss();
    },
    error => {
      let message='Tidak ada koneksi internet. Silakan periksa koneksi Anda.';
        this.presentToast(message);
        loading.dismiss();
    }  
    );
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }


}
