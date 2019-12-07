import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { forkJoin } from 'rxjs';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { temp } from './temparature';
import { FileService } from './file.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild('file', { static: false }) file;

  public files: Set<File> = new Set();

  constructor(public uploadService: FileService) { }
  public barChartLabels;
  temparature:temp[]=[];
  temp=[];
  showProgress = false;
  ngOnInit() {
    for(let i=1;i<366;i++){
     this.temp.push('day '+i);
    }
    console.log("this temp",this.temp);
    this.barChartLabels=this.temp;
   }
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    }
  ];
  public barChartData:any[] = [
    {data: this.temparature, label: 'Thermometer'}
  ];
  progress;
  canBeClosed = false;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  isData = false;
  data:any=[];
  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
    this.canBeClosed = true;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      //return this.dialogRef.close();
    }
    this.showProgress=true;
    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);
    console.log(this.progress);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    //this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = false;
      //this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
      this.getdata();
    });
  }

  getdata(){
    this.uploadService.getdata().subscribe((res)=>{
      console.log(" data "+JSON.stringify(res));
      this.data=<temp>res;
      console.log("typeOf ",this.data)
      for(let i=0;i<this.data.length;i++){
        this.temparature.push(this.data[i].val);
        this.showProgress = false;
      }
      console.log(" temparature data",this.temparature);
      this.isData=true;
    })
  }
 }
