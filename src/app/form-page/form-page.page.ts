import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController, Platform, LoadingController, NumericValueAccessor } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PortService } from '../services/port.service';
import { Port } from '../types/port';
import { Customer } from '../types/customer';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';


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
  docflow_seq:any;
  dataPickerSales:any;
  dataPickerItem:any;
  dataPickerCust:any;
  dataPickerCust2:any;
  dataPickerInvoice:any;
  currencyPipe:any;
  selectedItem:any;
  inputRowValues = [];
  deletedRowValues = [];
  dataGrid:any;
  ports: Port[];
  port: Port;
  dataPortFilter:any;
  dataCustFilter:any;
  portsSubscription: Subscription;
  customersSubscription: Subscription;
  customers: Customer[];
  customer: Customer;

  
  constructor(private storage: Storage,public loadingCtrl: LoadingController, public toastController: ToastController,
              private http: HttpClient,private router: Router,public navCtrl: NavController, private portService: PortService) { }

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
      this.inputRowValues=this.dataGrid;
      console.log(this.dataGrid)
      this.dataForm.forEach(async element => {
        this.docflow_seq=element.docflow_seq;
        console.log(element.docflow_seq)
        if(element.docflow_seq>1){
          this.isEnabled=false;
        }
        if(element.sales_id!="" || element.sales_id!=0){
          // this.getDataPickerCustomer(element.sales_id);
          this.getDataPickerCustomer2(element.sales_id);
          await this.getDataPickerInvoice(element.sales_id,element.cust_id, element.cust_idtemp,element.ware_id);
        }
        if(element.ware_id!="" || element.ware_id!=0){
          console.log(element.ware_id)
          this.storage.set('ware_id',element.ware_id);
          await this.getInitialValue()
        }
        
      });
      
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


  // async getDataPickerCustomer(sales_id){
  //   var formData : FormData = new FormData();
  //   formData.set('sales_id',sales_id)
  //     // consol.log('sales_id:'+element.sales_id)
  //   formData.set('username',this.username);
  //   formData.set('category','customer');
  //   this.http.post(this.api_url+'picker.php',formData)
  //   .subscribe((data)=>{
  //     this.dataPickerCust=data['data'];
  //     // console.log(this.dataPickerCust);
  //   });
  // }

  async getDataPickerCustomer2(sales_id){
    var formData : FormData = new FormData();
    formData.set('sales_id',sales_id)
    formData.set('username',this.username);
    formData.set('category','customer2');
    this.http.post(this.api_url+'picker.php',formData)
    .subscribe((data)=>{
      this.dataPickerCust2=data['data'];
      // console.log(this.dataPickerCust2);
    });
  }

  async getDataPickerInvoice(sales_id,cust_id,cust_idtemp,ware_id){
    var formData : FormData = new FormData();
    formData.set('sales_id',sales_id)
    formData.set('cust_id',cust_id)
    formData.set('cust_idtemp',cust_idtemp)
    formData.set('ware_id',ware_id)
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
    formData.set('detail',JSON.stringify(this.inputRowValues));
    formData.set('deleted',JSON.stringify(this.deletedRowValues)); 
    this.http.post(this.api_url+'edit_form.php',formData)
    .subscribe((response)=>{
      // window.location.reload();
      this.presentToast(response['message'])
      this.getDataForm();

      console.log(response)
    });
  }

  
  backPage(){
    this.router.navigateByUrl('/sales-order');
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

  addRow() {
    this.inputRowValues.push({})
  }

  // removes entry from the  inputRowValues array based on the id
  onDelete(index,doc_id,trans_id) {
    this.deletedRowValues.push({'doc_id':doc_id,'trans_id':trans_id})
    this.inputRowValues.splice(index,1)
    
  }

  getInitialValue(){
    this.portService.getDataItem().then(data => {
      this.dataPickerItem = data;
      this.inputRowValues.forEach(element =>{
        this.dataPortFilter = this.dataPickerItem.filter(item => {
         return item.item_id.toString().toLowerCase() == element.item_id
        })
        this.dataPortFilter.forEach(data => {
          element.item_id = data
          console.log('item_id: '+element.item_id)
        })
      })
    });
    this.portService.getDataCustomer().then(data => {
      this.dataPickerCust = data;
      this.dataForm.forEach(element => {
        this.dataCustFilter = this.dataPickerCust.filter(cust => {
          return cust.cust_id.toString().toLowerCase() == element.cust_id
        })
        this.dataCustFilter.forEach(data => {
          element.cust_id = data;
          console.log('cust_id: '+element.cust_id)
        })
      })
    })
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
    this.dataForm.forEach(async element => {
      if(element.ware_id!="" || element.ware_id!=0){
        console.log(element.ware_id)
        this.storage.set('ware_id',element.ware_id);
      }
    })
    
    this.portsSubscription = this.portService.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }
      event.component.items = this.filterPorts(ports, text);
      event.component.endSearch();
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
    this.dataForm.forEach(async element => {
      if(element.sales_id!="" || element.sales_id!=0){
        console.log(element.ware_id)
        this.storage.set('sales_id',element.sales_id);
      }
    })
    
    this.customersSubscription = this.portService.getCustomersAsync().subscribe(customers => {
      // Subscription will be closed when unsubscribed manually.
      if (this.customersSubscription.closed) {
        return;
      }
      event.component.items = this.filterCustomers(customers, text);
      event.component.endSearch();
    });
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedItem = event.value;

    console.log(this.selectedItem)
  }

  updateFlow(flow){
    var formData : FormData = new FormData();
    formData.set('menu', this.menu);
    formData.set('doc_id',this.doc_id);
    formData.set('flow',flow);
    this.http.post(this.api_url+'update_flow.php',formData).subscribe((response) => {
      this.presentToast(response['message'])
      this.getDataForm();
      console.log(response)
    })
    console.log(flow);
  }


}
