import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NewUserComponent } from '../account/new-user/new-user.component';
import { UserEditComponent } from '../account/user-edit/user-edit.component';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private confirmService:ConfirmService) {
  }
  canDeactivate(component: UserEditComponent|NewUserComponent): Observable<boolean> | boolean {
    if(component instanceof UserEditComponent){
      if (component.editForm.dirty)
      return this.confirmService.confirm("تعديل مستخدم" ,"هل تريد الخروج قبل حفظ هذه البيانات");
    }else{
      if (component.registerForm.dirty)
      return this.confirmService.confirm("إضافة مستخدم" ,"هل تريد الخروج قبل حفظ هذه البيانات");
    }
      // return confirm('if you move away any changes will be lost ?');
    return true;
  }

}
