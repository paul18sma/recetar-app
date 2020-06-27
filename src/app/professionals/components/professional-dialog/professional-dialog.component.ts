import { Component, OnInit, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { Prescriptions } from '@interfaces/prescriptions';
import { PrescriptionsService } from "@services/prescriptions.service";

@Component({
  selector: 'app-professional-dialog',
  templateUrl: './professional-dialog.component.html',
  styleUrls: ['./professional-dialog.component.sass'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ],
})
export class ProfessionalDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProfessionalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private prescriptionsService: PrescriptionsService
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletePrescription(prescription: Prescriptions){
    this.prescriptionsService.deletePrescription(prescription._id).subscribe( success => {
      this.dialogRef.close(success);
    });
  }
}

export interface DialogData {
  prescription: Prescriptions;
  dialogType: string;
  text: string;
}
