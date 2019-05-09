import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/basic/login/login.component';
import { HomepageComponent } from './components/dashboard/general/homepage/homepage.component';
import { TimePickerComponent } from './components/dashboard/dashboard-components/time-picker/time-picker.component';
import { LearnerRegistrationFormComponent } from './components/dashboard/dashboard-components/learner-registration/learner-registration-form/learner-registration-form.component';
import { DashboardRestrictGuard } from './guards/dashboard-restrict.guard';
import { AdminLearnerPaymentPanelComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-panel/admin-learner-payment-panel.component';
import { AdminLearnerPaymentInvoiceComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-invoice/admin-learner-payment-invoice.component';
import { AdminLearnerPaymentProductsComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-products/admin-learner-payment-products.component';
import { AdminLearnerPaymentRegistrationComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-registration/admin-learner-payment-registration.component';
import { AdminLearnerPaymentOtherComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-other/admin-learner-payment-other.component';
import { AdminLearnerPaymentSussessComponent } from './components/dashboard/dashboard-components/admin-learner-payment/admin-learner-payment-details/admin-learner-payment-sussess/admin-learner-payment-sussess.component';
import { TutorInfoComponent } from './components/dashboard/dashboard-components/tutor-info/tutor-info-list/tutor-info.component';
import { CoursesListComponent } from './components/dashboard/dashboard-components/courses/courses-list/courses-list.component';
import { InvoiceDataEntryComponent } from './components/dashboard/dashboard-components/invoice-data-entry/invoice-data-entry-list/invoice-data-entry.component';

const routes: Routes = [
  { path: '',
    component: HomepageComponent,
    canActivate: [DashboardRestrictGuard],
    children: [
      // Payments Area
      { path: 'payment/invoice', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
          { path: ':id', component: AdminLearnerPaymentInvoiceComponent },
        ]
      },
      { path: 'payment/products', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
          { path: ':id', component: AdminLearnerPaymentProductsComponent, },
        ]
      },
      { path: 'payment/registration', pathMatch: 'prefix', component: AdminLearnerPaymentPanelComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
          { path: ':id', component: AdminLearnerPaymentRegistrationComponent, },
        ]
      },
      { path: 'payment/other', pathMatch: 'prefix', component: AdminLearnerPaymentOtherComponent,
        children: [
          { path: 'success', component: AdminLearnerPaymentSussessComponent, },
        ]
      },
      // End Payment Area
      { path: 'tutor', component: TutorInfoComponent },
      { path: 'learnerRegistration', component: LearnerRegistrationFormComponent },
      { path: 'timePicker', component: TimePickerComponent },
      { path: 'courseslist', component: CoursesListComponent},
      { path: 'invoicedataentry', component: InvoiceDataEntryComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
