import { EvaluationService } from 'src/app/_services/evaluation.service';
import { Dashboard } from './../_models/dashboard';
import { Router } from '@angular/router';
import { User } from './../_models/user';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User
  dashboard: Dashboard

  constructor(private accountService: AccountService, private router: Router,
    private evalService: EvaluationService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      if (!this.user?.roles.includes("Admin")) {
        this.router.navigateByUrl("/evaluation/show-evaluation/" + user.id)
      }
      this.evalService.getDashboard().subscribe((response: Dashboard) => {
        this.dashboard = response
      })

    })

  }
  ngOnInit(): void {

  }

  setProgressColor(grade) {
    if (grade == 'ممتاز')
      return "#78C000";
      if (grade == 'جيد جدا')
      return "blue"
      if (grade == 'جيد')
      return "orange"
      if (grade == 'مرضي')
      return "brown"
      if (grade == 'غير مرضي')
      return "red"
  }

}
