import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { CreatePostComponent } from "./posts/create-post/create-post.component";
import { AuthGuard } from "./auth/auth.guard";
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "posts", component: PostListComponent },
  { path: "create", component: CreatePostComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: CreatePostComponent,
    canActivate: [AuthGuard]
  },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
