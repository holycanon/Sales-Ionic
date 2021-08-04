import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-white-screen',
  templateUrl: './white-screen.page.html',
  styleUrls: ['./white-screen.page.scss'],
})
export class WhiteScreenPage implements OnInit {
  username:any;
  constructor(private storage: Storage,private router: Router) { }

  ngOnInit() {
    this.getData()
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


}
