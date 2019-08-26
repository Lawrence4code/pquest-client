import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() posts: Post[];

  // posts = [
  //   {title: 'First Post', content: 'First\'s post content'},
  //   {title: 'Second Post', content: 'Second\'s post content'},
  //   {title: 'Third Post', content: 'Third\'s post content'},
  //   {title: 'Fourth Post', content: 'Fourth\'s post content'}
  // ]

  constructor() { }

  ngOnInit() {
  }

}
