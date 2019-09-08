import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';

import { CreatePostComponent } from './create-post/create-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    CreatePostComponent,
    PostListComponent,
    
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    NgxUiLoaderModule,
    MatDialogModule
  ]
})
export class PostsModule { }
