import { Component } from "@angular/core";


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html'
})

export class CreatePostComponent {
    enteredValue = ""
    newPost = "No content!";

    onAddPost() {
        this.newPost = this.enteredValue;
    }
}