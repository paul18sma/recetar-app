import { Component, OnInit, OnDestroy, Input, Injectable, EventEmitter, Output } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Prescriptions } from '@interfaces/prescriptions';

@Injectable()
export class CounterDownService {
  getCounter(tick) {
    return timer(0, tick);
  }
}
@Component({
  selector: 'app-prescription-undo',
  templateUrl: './prescription-undo.component.html',
  styleUrls: ['./prescription-undo.component.sass'],
  providers: [CounterDownService]
})
export class PrescriptionUndoComponent implements OnInit, OnDestroy {

  @Output() cancelDispenseEvent = new EventEmitter();
  @Input() dispensedAt: Date;
  @Input() prescriptionId: string;
  @Input() lapseTime: number;
  subscriptions: Subscription = new Subscription();
  tick: number = 1000;
  maxCounter: number = 7200;
  progress: number = 100;
  typeTime: string;
  counter: number;

  constructor(private counterDownService: CounterDownService) {}

  ngOnInit() {
    this.counter = this.getTimeeDiffInSeconds();

    this.subscriptions.add(this.counterDownService
      .getCounter(this.tick)
      .subscribe(() => {
        this.progress = parseFloat((this.counter * 100 / this.maxCounter).toFixed(2));
        this.counter--;
        if(this.counter > 3600) this.typeTime = 'h';
        if(this.counter < 3600) this.typeTime = 'm';
        if(this.counter < 60) this.typeTime = 's';
      }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // on complete timer, destroy this component and it subscriptions
  }

  cancelDispense(prescriptionId: string){
    this.cancelDispenseEvent.emit(prescriptionId);
  }

  getTimeeDiffInSeconds():number{
    const dispensedAt = moment(this.dispensedAt);
    dispensedAt.add(this.lapseTime, 'hours');
    // dispensedAt.add(10, 'seconds');
    const now = moment();
    const diff = dispensedAt.diff((now), 'seconds');
    return diff;
  }

}
