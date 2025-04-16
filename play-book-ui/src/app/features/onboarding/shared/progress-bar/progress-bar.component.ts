import {Component, computed, input} from '@angular/core';
import {BrnProgressComponent, BrnProgressIndicatorComponent} from "@spartan-ng/brain/progress";
import {NgClass, NgForOf} from '@angular/common';
import {HlmProgressDirective, HlmProgressImports, HlmProgressIndicatorDirective} from '@spartan-ng/ui-progress-helm';

@Component({
  selector: 'app-progress-bar',
  imports: [
    BrnProgressComponent,
    BrnProgressIndicatorComponent,
    HlmProgressDirective,
    HlmProgressIndicatorDirective,
    NgForOf,
    NgClass
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  progressBars = Array(5).fill(0);
  value = 100;
  slideNumberInput = input<number>(1);
  slideNumber = computed(() => this.slideNumberInput());
}
