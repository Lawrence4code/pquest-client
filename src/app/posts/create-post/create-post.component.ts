import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from '../post.model'


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent {
    postTitle = ""
    postContent = ""

    @Output() postCreated = new EventEmitter<Post>();

    onAddPost() {
        const post: Post = { title: this.postTitle, content: this.postContent };
        this.postCreated.emit(post);
    }
}