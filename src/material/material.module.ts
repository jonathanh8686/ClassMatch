import { NgModule } from '@angular/core';
import {
  MatRadioModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatSortModule,
  MatTabsModule,
  MatInputModule,
  MatTableModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatMenuModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatTableModule,
  MatInputModule,
  MatTabsModule,
  MatSortModule,
  MatBadgeModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatRadioModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSnackBarModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class MaterialModule { }