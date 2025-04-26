import {Component, computed, input} from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import {NgForOf} from '@angular/common';
import {Document} from '../../../../../../store/models/document.model';
@Component({
  selector: 'app-doc-card',
  imports: [
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmBadgeDirective,
    NgForOf,
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.css'
})
export class DocCardComponent {
   documentSignal = input<Document>();
    doc = computed(() => this.documentSignal());
}
