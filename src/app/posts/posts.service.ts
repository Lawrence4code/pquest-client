import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from '../../environments/environment'

const BACKEND_URL = `${environment.apiURL}/posts`;

@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private httpClientService: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClientService
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${BACKEND_URL}${queryParams}`
      )
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                author: post.author,
                authorName: post.authorName,
                createdAt: post.created_at
              };
            }),
            maxPosts: postsData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClientService.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      author: string;
      authorName: string;
      created_at: Date;
    }>(`${BACKEND_URL}/${id}`);
  }

  deletePost(postId: string) {
    return this.httpClientService.delete(`${BACKEND_URL}/${postId}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.httpClientService
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(res => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        author: null,

      };
    }
    this.httpClientService
      .put(`${BACKEND_URL}/${id}`, postData)
      .subscribe(res => {
        this.router.navigate(["/"]);
      });
  }
}
