import {Component, inject, Input} from '@angular/core';
import {
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import {Company} from '../../../../store/models/company.model';
import {NgClass} from '@angular/common';
import {Store} from '@ngrx/store';
import {SelectCompany} from '../../../../store/actions/company.actions';
@Component({
  selector: 'app-companies',
  imports: [
    HlmCardDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    NgClass
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  private store = inject(Store);
  @Input() org!: Company;

   isLightColor(hexColor: string| undefined) {
    // Default to dark if no color provided
    if (!hexColor) return false;

    // Remove # if present
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate perceived brightness using the formula
    // (299*R + 587*G + 114*B) / 1000
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return true if the color is light (brightness > 128)
    return brightness > 128;
  }

  selectOrganization(org: Company) {
    this.store.dispatch(SelectCompany({selectedCompany: org}))
  }


}
