import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { delay } from 'rxjs/operators';
import { Port } from '../types/port';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PortService {
  private items: Port[] = [];
 
  username:any;
  ware_id:any;
  constructor( private storage: Storage,
    private http: HttpClient){}

  url:string="https://project.graylite.com/anugrahsteel/";
  async getDataItem(){
    await this.storage.get('username').then(val => {
      this.username=val;
      console.log(this.username)
    });
    await this.storage.get('ware_id').then(val=>{
      this.ware_id=val
      console.log(this.ware_id)
    });
    return new Promise(resolve => {
      var formData : FormData = new FormData();
      formData.set('username',this.username);
      formData.set('ware_id',this.ware_id)
      formData.set('category','item');
      this.http.post(this.url+'picker.php',formData)
      .subscribe((data)=>{
        this.items=data['data'];
        resolve(this.items)
        console.log(this.items);
        // console.log(this.dataPickerSales);
      });
    })
  }


  getPorts(page?: number, size?: number): Port[] {
    this.getDataItem();
    let ports = [];

    this.items.forEach(country => {
        ports.push(country);
    });

    if (page && size) {
      ports = ports.slice((page - 1) * size, ((page - 1) * size) + size);
    }

    return ports;
  }

  getPortsAsync(page?: number, size?: number, timeout = 1000): Observable<Port[]> {
    return new Observable<Port[]>(observer => {
      observer.next(this.getPorts(page, size));
      observer.complete();
    }).pipe(delay(timeout));
  }
}
