import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDialogRef, MatDialog } from "@angular/material";
import { MessageComponent } from "src/app/message/message.component";
import { PostModalComponent } from "src/app/post-modal/post-modal.component";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"]
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSub: Subscription;
  totalPost = 0;
  postsPerPage = 2;
  pageSizeOption = [1, 2, 5, 10];
  currentPage = 1;
  userId: string;
  authStatusSubs: Subscription;
  userIsAuthenticated = false;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.ngxLoader.start();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.ngxLoader.stop();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.totalPost = postData.postCount;
        this.posts = postData.posts.reverse();
      });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.ngxLoader.start();
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.ngxLoader.stop();
      },
      () => {
        this.ngxLoader.stop();
      }
    );
  }

  openDialog(post: any): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width: "90%",
      data: { post: post }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  onChangePage(pageData: PageEvent) {
    this.ngxLoader.start();
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.ngxLoader.stop();
  }

  ngOnDestroy() {
    this.postsSub && this.postsSub.unsubscribe();
    this.authStatusSubs && this.authStatusSubs.unsubscribe();
    this.posts = [];
  }
}
