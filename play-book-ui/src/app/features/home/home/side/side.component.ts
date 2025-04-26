import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {radixDashboard} from '@ng-icons/radix-icons'
import {heroHeart, heroPencilSquare} from '@ng-icons/heroicons/outline';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-side',
  imports: [
    NgIcon,
    NgClass
  ],
  providers:[
    provideIcons({radixDashboard, heroPencilSquare, heroHeart})
  ],
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent {
  selectedItem: string = 'main';
}
