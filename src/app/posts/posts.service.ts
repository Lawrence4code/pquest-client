import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  
  constructor(private httpClientService: HttpClient, private router: Router ) { }

  getPosts() {
    this.httpClientService.get<{ message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map(postsData => {
      return postsData.posts.map( post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPost) => {
        this.posts = transformedPost;
        console.log('transformedPost', transformedPost)
        this.postsUpdated.next([...this.posts]);
    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id:string) {
    console.log('ggg', id, this.posts);
    // return {...this.posts.find(post => post.id === id)}
    return this.httpClientService.get<{_id: string, title: string, content: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  deletePost(postId:string) {
    this.httpClientService.delete(`http://localhost:3000/api/posts/${postId}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  addPost(title:String, content:String) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClientService.post<{ message:string, postId:string }>("http://localhost:3000/api/posts", post).subscribe((res) => {
      console.log('res.message', res.message);
      const id = res.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })
  }

  updatePost(id:string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.httpClientService.put(`http://localhost:3000/api/posts/${id}`, post)
    .subscribe(res => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(post => post.id === id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })
  }
}
