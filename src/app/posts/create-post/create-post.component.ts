import { Component } from "@angular/core";
import { Post } from '../post.model'
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service'


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent {
    postTitle = ""
    postContent = ""

    constructor(public postsService: PostsService ) {

    }

    onAddPost(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.postsService.addPost(form.value.title,form.value.content);
        form.resetForm();
    }
}