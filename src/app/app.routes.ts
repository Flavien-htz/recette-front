import {Routes} from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {RecetteComponent} from "./recette/recette.component";
import {DetailComponent} from './recette/detail/detail.component';
import {NewComponent} from './recette/new/new.component';
import {UpdateComponent} from './recette/update/update.component';

export const routes: Routes = [
  {path:'', redirectTo: 'recette', pathMatch: 'full'},
  {path:'menu', component: MenuComponent},
  {path:'recettes', component: RecetteComponent},
  {path:'recettes/show/:id', component: DetailComponent},
  {path:'recettes/update/:id', component: UpdateComponent},
  {path:'recettes/create', component: NewComponent},

];
