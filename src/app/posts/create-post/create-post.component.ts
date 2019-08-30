import { Component, OnInit } from "@angular/core";
import { Post } from '../post.model'
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { PostsService } from '../posts.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent implements OnInit {
    postTitle = ""
    postContent = ""
    post: Post;
    private mode = "create"
    private postId: string = "";
    isLoading = false;
    form: FormGroup;
    imagePreview: any;

    constructor(public postsService: PostsService, private activatedRoute: ActivatedRoute ) {

    }

    ngOnInit() {

        this.form = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
            'content': new FormControl(null, { validators: [Validators.required, Validators.maxLength(50)]}),
            'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
        })
        this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath};
                    this.form.setValue({ 'title': this.post.title, 'content': this.post.content, image: this.post.imagePath });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        })
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        }
        reader.readAsDataURL(file);
    };

    onSavePost() {
        if(this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if(this.mode === "create") {
            this.postsService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }
}