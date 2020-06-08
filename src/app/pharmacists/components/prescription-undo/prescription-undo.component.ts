import { Component, OnInit, OnDestroy, Input, Injectable } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import * as moment from 'moment';

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

  @Input() dispensedAt: Date;
  @Input() lapseTime: number;
  subscriptions: Subscription = new Subscription();
  counter = 7200;
  tick = 1000;

  constructor(private counterDownService: CounterDownService) {}

  ngOnInit() {
    this.counter = this.getTimeeDiffInSeconds();
    this.subscriptions.add(this.counterDownService
      .getCounter(this.tick)
      .subscribe(() => this.counter--));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // on complete timer, destroy this component and it subscriptions
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
