import {Component, OnInit, Inject, inject} from '@angular/core';
import { NavComponent } from '../home/nav/nav.component';
import { RouterOutlet } from '@angular/router';
import {ChatWindowComponent} from '../chat-window/chat-window.component';
import { SideComponent } from '../home/side/side.component';
import {Store} from '@ngrx/store';
import { LoadSelectedCompany} from '../../../store/actions/company.actions';

@Component({
  selector: 'app-home-page',
  imports: [
    NavComponent,
    SideComponent,
    RouterOutlet,
    ChatWindowComponent
  ],
  templateUrl: './home-page.component.html',
  standalone: true,
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  store = inject(Store)

  ngOnInit(): void {
    this.store.dispatch(LoadSelectedCompany())
  }
}
