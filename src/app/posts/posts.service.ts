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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  
  constructor(private httpClientService: HttpClient, private router: Router ) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClientService.get<{ message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams )
    .pipe(map(postsData => {
      return { posts: postsData.posts.map( post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      }), maxPosts: postsData.maxPosts};
    }))
    .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts:[...this.posts], postCount: transformedPostData.maxPosts });
    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id:string) {
    // return {...this.posts.find(post => post.id === id)}
    return this.httpClientService.get<{_id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  deletePost(postId:string) {
    return this.httpClientService.delete(`http://localhost:3000/api/posts/${postId}`);
  }

  addPost(title:string, content:string, image: File) {
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title )

    this.httpClientService.post<{ message:string, post: Post }>("http://localhost:3000/api/posts", postData).subscribe((res) => {
      this.router.navigate(['/'])
    })
  }

  updatePost(id:string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof image === 'object') {
      postData = new FormData;
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else { 
      postData = { id: id, title: title, content: content, imagePath: image };
    }
    const post: Post = { id, title, content, imagePath: null };
    this.httpClientService.put(`http://localhost:3000/api/posts/${id}`, postData)
    .subscribe(res => {
      this.router.navigate(['/'])
    })
  }
}
