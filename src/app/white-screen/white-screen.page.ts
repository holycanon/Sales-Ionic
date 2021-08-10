import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-white-screen',
  templateUrl: './white-screen.page.html',
  styleUrls: ['./white-screen.page.scss'],
})
export class WhiteScreenPage implements OnInit {
  username:any;
  url:any="https://project.graylite.com/anugrahsteel/";
  data:any;
  VersionNumber:string;
  apiVersion:string;
  constructor(private storage: Storage,private router: Router,private http: HttpClient,private appVersion: AppVersion,private alertCtrl: AlertController,) { }

  ngOnInit() {
    this.checkVersion();
    
  }

  async getData(){    
    await this.storage.get('username').then((val) => {
      this.username = val;
      console.log(this.username);
    });
    if(this.username==null || this.username==''){
      this.router.navigateByUrl('/login');
    }else{
      this.router.navigateByUrl('/home-page');
    }
  }

  checkVersion(){
    this.http.get(this.url+'version_check.php')
    .subscribe(response => {
      this.data=response;
      console.log(this.data);
      this.appVersion.getVersionNumber()
      .then(value =>{
        this.VersionNumber=value;
        console.log(this.VersionNumber);
        console.log(this.data.version);
        if(this.VersionNumber==this.data.version){
          this.getData();
        }else{
          this.presentAlertFailed(this.data.message,this.data.link);
        }
      });
    });
  }

  async presentAlertFailed(message,link) {
    const alert = await this.alertCtrl.create({
      message: `<p>`+message+`<br><a href="`+link+`" download>Click disini untuk download!</a></p>`,
      cssClass: 'alert-failedcolor',
      buttons: [{
        text: 'Ok',
        handler: () =>{
          navigator['app'].exitApp();
        }
      }],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
}

  
}

