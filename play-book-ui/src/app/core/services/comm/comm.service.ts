import {effect, inject, Injectable, Injector, runInInjectionContext, signal} from '@angular/core';
import {Message} from '../../../shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class CommService {
  private com = signal<Message>({messageType: '', message: null});
  private  readonly injector = inject(Injector);
  setCom(message: Message) {
    this.com.set(message);
  }

  getComMessage(): Message {
    const route = this.com();
    this.com.set({messageType: '', message: null});
    return route;
  }

  onComRequest(callback: (route: any ) => void) {
    return runInInjectionContext(this.injector, () =>
      effect(() => {
        const route = this.com();
        if (route) {
          callback(route);
        }
      })
    );
  }
}
