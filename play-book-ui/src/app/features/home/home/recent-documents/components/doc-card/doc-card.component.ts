import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { BrnHoverCardModule } from '@spartan-ng/brain/hover-card';
import {HlmHoverCardContentComponent, HlmHoverCardModule} from '@spartan-ng/ui-hovercard-helm';
import {Document} from '../../../../../../store/models/document.model';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';
@Component({
  selector: 'app-doc-card',
  imports: [
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmBadgeDirective,
    NgForOf,
    HlmBadgeDirective,
    HlmHoverCardModule,
    BrnHoverCardModule,
    HlmHoverCardContentComponent,
    HlmAvatarModule,
    HlmCardFooterDirective,
    NgIf,
    HlmHoverCardContentComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocCardComponent {
  datePipe = inject(DatePipe);
   documentSignal = input<Document>();
    doc = computed(() => this.documentSignal());

  getRelativeTime(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    // Default to formatted date for older dates
    return this.datePipe.transform(date, 'MMM d, y') || dateString;
  }
  getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName && !lastName) return '?';

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial || firstInitial;
  }

  /**
   * Generates a consistent color based on user ID that will contrast well with white text
   */
  getAvatarColor(userId: string): string {
    // If no user ID is provided, use a default color
    if (!userId) return '#6366F1'; // Indigo color

    // Generate a hash from the userId for consistency
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to a positive number
    hash = Math.abs(hash);

    // List of background colors that contrast well with white text (all are dark/saturated enough)
    const contrastColors = [
      '#3B82F6', // Blue
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#D946EF', // Fuchsia
      '#EC4899', // Pink
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#14B8A6', // Teal
      '#0EA5E9', // Sky blue
      '#6D28D9', // Purple
      '#7C3AED', // Violet
      '#BE185D', // Rose
      '#059669', // Green
      '#2563EB', // Blue
      '#4F46E5', // Indigo
      '#7E22CE', // Purple
      '#0891B2', // Cyan
      '#B91C1C', // Red
      '#0D9488'  // Teal
    ];

    // Use the hash to pick a color from our list
    return contrastColors[hash % contrastColors.length];
  }
}
