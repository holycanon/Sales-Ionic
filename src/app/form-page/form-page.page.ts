import { Component, OnInit, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController, Platform, LoadingController, NumericValueAccessor } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.page.html',
  styleUrls: ['./form-page.page.scss'],
})
export class FormPagePage implements OnInit {
  tab: string = "form";
  doc_id:any;
  username:any;
  menu:any;
  api_url:string="https://project.graylite.com/anugrahsteel/";
  dataForm:any;
  isEnabled:boolean=true;
  selectedRadioGroup: any;
  dataPickerWH:any;
  dataPickerSales:any;
  dataPickerCust:any;
  dataPickerCust2:any;
  dataPickerInvoice:any;
  currencyPipe:any;
  onDelete = new EventEmitter<any>();
  inputRowValues = [{}];
  dataGrid:any;

  
  constructor(private storage: Storage,public loadingCtrl: LoadingController, public toastController: ToastController,
              private http: HttpClient,private router: Router,public navCtrl: NavController) { }

  async ngOnInit() {
    await this.storage.get('menu').then((val) => {
      this.menu=val
      console.log(this.menu)
    });
    await this.storage.get('doc_id').then((val) => {
      this.doc_id = val
      console.log(this.doc_id)
    });
    await this.storage.get('username').then((val) => {
      this.username=val
    });
    this.getDataForm();
    this.getDataPickerWH();
    this.getDataPickerSales();
 
  }

  async getDataForm(){

    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('doc_id',this.doc_id);
    formData.set('menu',this.menu)
    this.http.post(this.api_url+'form_get_data.php',formData)
    .subscribe((data)=>{
      this.dataForm=data['header'];
      this.dataGrid=data['detail'];
      this.dataForm.forEach(async element => {
        console.log(element.docflow_seq)
        if(element.docflow_seq>1){
          this.isEnabled=false;
        }
        if(element.sales_id!="" || element.sales_id!="0"){
          await this.getDataPickerCustomer();
          await this.getDataPickerCustomer2();
          await this.getDataPickerInvoice();
        }
      })
      console.log(this.dataForm);
    });
  }

  async getDataPickerWH(){
    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('category','warehouse');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerWH=data['data'];
      // console.log(this.dataPickerWH);
    });
  }

  async getDataPickerSales(){
    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('category','sales');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerSales=data['data'];
      // console.log(this.dataPickerSales);
    });
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'EUR', true, '1.2-2');
  }

  async getDataPickerCustomer(){
    var formData : FormData = new FormData();
    this.dataForm.forEach(element => {
      formData.set('sales_id',element.sales_id)
      // console.log('sales_id:'+element.sales_id)
     });
    formData.set('username',this.username);
    formData.set('category','customer');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerCust=data['data'];
      // console.log(this.dataPickerCust);
    });
  }

  async getDataPickerCustomer2(){
    var formData : FormData = new FormData();
    this.dataForm.forEach(element => {
      formData.set('sales_id',element.sales_id)
     });
    formData.set('username',this.username);
    formData.set('category','customer2');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerCust2=data['data'];
      // console.log(this.dataPickerCust2);
    });
  }

  async getDataPickerInvoice(){
    var formData : FormData = new FormData();
    this.dataForm.forEach(element => {
      formData.set('sales_id',element.sales_id)
      formData.set('cust_id',element.cust_id)
      formData.set('cust_idtemp',element.cust_idtemp)
      formData.set('ware_id',element.ware_id)
     });
    formData.set('username',this.username);
    formData.set('category','invoice');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerInvoice=data['data'];
      // console.log(this.dataPickerInvoice);
    });
  }

  async saveForm(){

    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('menu',this.menu);
    this.dataForm.forEach(element => {
     formData.set('header',JSON.stringify(element))

    });

    this.http.post(this.api_url+'edit_form.php',formData)
    .subscribe((response)=>{
      // window.location.reload();
      this.presentToast(response['message'])
      this.getDataForm();

      console.log(response)
    });
  }

  
  backPage(){
    this.navCtrl.pop();
  }

  public radioGroupChange(event) {
    console.log("radioGroupChange",event.detail.value);
    this.selectedRadioGroup = event.detail.value;
  }

  
  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

  deleteClicked() {
    console.log("deleteClicked")
    this.onDelete.next(this.dataGrid)
  }
}
