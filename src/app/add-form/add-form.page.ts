import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController, Platform, LoadingController, NumericValueAccessor } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PortService } from '../services/port.service';
import { Port } from '../types/port';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Customer } from '../types/customer';


@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit {
  tab: string = "form";
  doc_id:any=-1;
  username:any;
  menu:any;
  api_url:string="https://project.graylite.com/anugrahsteel/";
  dataForm=[];
  isEnabled:boolean=true;
  selectedRadioGroup: any;
  dataPickerWH:any;
  dataPickerSales:any;
  dataPickerItem:any;
  dataPickerCust:any;
  dataPickerCust2:any;
  dataPickerInvoice:any;
  doc_extern:any;
  doc_date:any = moment().format("YYYY-MM-DD");
  doc_deldate:any = moment().format("YYYY-MM-DD");
  doc_orderstatus:any="1";
  doc_deliverystatus:any="Diambil";
  doc_term:any;
  doc_duedate:any = moment().format("YYYY-MM-DD");
  ware_id:any;
  sales_id:any;
  cust_id:any;
  cust_tempNIK:any;
  cust_tempdesc:any;
  doc_deliveryaddress:any;
  doc_deliverycity:any;
  doc_pembayaran:any="2";
  doc_umtitipan:any="1";
  doc_total:any=0;
  doc_discremark:any=0;
  inputdiscvalue:any=0;
  doc_discvalue:any=0;
  doc_vattype:any="2";
  doc_vat:any;
  doc_ongkosangkut:any=0;
  cust_idtemp:any;
  invoice_id:any;
  doc_ongkir:any=0;
  doc_returremark:any="0";
  doc_ongkosretur:any=0;
  doc_remark:any;
  item_id:any;
  trans_qty:any;
  trans_price:any;
  trans_total:any;

  inputRowValues = [];
  dataGrid:any;
  ports: Port[];
  port: Port;
  portsSubscription: Subscription;
  customersSubscription: Subscription;
  customers: Customer[];
  customer: Customer;

  
  constructor(private storage: Storage,public loadingCtrl: LoadingController, public toastController: ToastController,
              private http: HttpClient,private router: Router,public navCtrl: NavController,private portService: PortService) { }

  async ngOnInit() {
    await this.storage.get('menu').then((val) => {
      this.menu=val
      console.log(this.menu)
    });
    await this.storage.get('username').then((val) => {
      this.username=val
    });

    this.getDataPickerWH();
    this.getDataPickerSales();
 
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

  async getDataPickerItem(){
    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('ware_id',this.ware_id)
    formData.set('category','item');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerItem=data['data'];
      console.log(this.dataPickerItem);
      // console.log(this.dataPickerSales);
    });
  }

  // async getDataPickerCustomer(){
  //   var formData : FormData = new FormData();
  //   formData.set('sales_id',this.sales_id)
  //   formData.set('username',this.username);
  //   formData.set('category','customer');
  //   this.http.post(this.api_url+'picker.php',formData)
  //   .subscribe((data)=>{
  //     this.dataPickerCust=data['data'];
  //     // console.log(this.dataPickerCust);
  //   });
  // }

  async getDataPickerCustomer2(){
    var formData : FormData = new FormData();
    formData.set('sales_id',this.sales_id)
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
    formData.set('sales_id',this.sales_id)
    formData.set('cust_id',this.cust_id)
    formData.set('cust_idtemp',this.cust_idtemp)
    formData.set('ware_id',this.ware_id)
    formData.set('username',this.username);
    formData.set('category','invoice');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerInvoice=data['data'];
      // console.log(this.dataPickerInvoice);
    });
  }

  async saveForm(){
    this.dataForm.push({
      'doc_extern':this.doc_extern,
      'doc_date':this.doc_date,
      'doc_deldate':this.doc_deldate,
      'doc_orderstatus':this.doc_orderstatus,
      'doc_deliverystatus':this.doc_deliverystatus,
      'doc_term':this.doc_term,
      'doc_duedate':this.doc_duedate,
      'ware_id':this.ware_id,
      'sales_id':this.sales_id,
      'cust_id':this.cust_id,
      'cust_tempNIK':this.cust_tempNIK,
      'cust_tempdesc':this.cust_tempdesc,
      'doc_deliveryaddress':this.doc_deliveryaddress,
      'doc_deliverycity':this.doc_deliverycity,
      'doc_pembayaran':this.doc_pembayaran,
      'doc_umtitipan':this.doc_umtitipan,
      'doc_total':this.doc_total,
      'doc_discremark':this.doc_discremark,
      'inputdiscvalue':this.inputdiscvalue,
      'doc_discvalue':this.doc_discvalue,
      'doc_vattype':this.doc_vattype,
      'doc_vat':this.doc_vat,
      'doc_ongkosangkut':this.doc_ongkosangkut,
      'cust_idtemp':this.cust_idtemp,
      'invoice_id':this.invoice_id,
      'doc_ongkir':this.doc_ongkir,
      'doc_returremark':this.doc_returremark,
      'doc_ongkosretur':this.doc_ongkosretur,
      'doc_remark':this.doc_remark,
    })
    var formData : FormData = new FormData();
    formData.set('username',this.username);
    formData.set('menu',this.menu);
    this.dataForm.forEach(element => {
     formData.set('header',JSON.stringify(element))

    });
    formData.set('detail',JSON.stringify(this.inputRowValues));
    this.http.post(this.api_url+'save_form.php',formData)
    .subscribe((response)=>{
      // window.location.reload();
      if(response['error']==true){
        this.presentToast(response['message']);
      }else{
        this.presentToast(response['message']);
        this.storage.set('doc_id',response['doc_id']);
        this.router.navigateByUrl('/form-page');
      }
      
      

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
      position: "bottom",
    });
    toast.present();
  }

  addRow() {
    this.inputRowValues.push({'item_id':this.item_id,'trans_price':this.trans_price,'trans_qty':this.trans_qty,'trans_total':this.trans_total});
  }

  // removes entry from the  inputRowValues array based on the id
  onDelete(index) {
    this.inputRowValues.splice(index,1)
    
  }

  filterPorts(ports: Port[], text: string) {
    return ports.filter(port => {
      return port.item_desc.toLowerCase().indexOf(text) !== -1 ||
        port.item_no.toLowerCase().indexOf(text) !== -1 ||
        port.item_id.toString().toLowerCase().indexOf(text) !== -1;
    });
  }

  filterCustomers(customers: Customer[], text: string) {
    return customers.filter(customer => {
      return customer.cust_name.toLowerCase().indexOf(text) !== -1 ||
      customer.cust_no.toLowerCase().indexOf(text) !== -1 ||
      customer.cust_id.toString().toLowerCase().indexOf(text) !== -1;
    });
  }

  searchCustomers(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.customersSubscription) {
      this.customersSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.customersSubscription) {
        this.customersSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.storage.set('sales_id',this.sales_id);

    
    this.customersSubscription = this.portService.getCustomersAsync().subscribe(customers => {
      // Subscription will be closed when unsubscribed manually.
      if (this.customersSubscription.closed) {
        return;
      }
      event.component.items = this.filterCustomers(customers, text);
      event.component.endSearch();
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.portsSubscription) {
        this.portsSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }
    this.storage.set('ware_id',this.ware_id);
    this.portsSubscription = this.portService.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(ports, text);
      event.component.endSearch();
    });
  }

  



}
