import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSub: Subscription;


  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.posts = this.postsService.getPost();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }
  ngOnDestroy() {
    this.postsSub && this.postsSub.unsubscribe();
  }
}
