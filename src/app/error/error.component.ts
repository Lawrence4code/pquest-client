import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"]
})
export class ErrorComponent implements OnInit {
  private message: string = "Unknown error!";
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  ngOnInit() {}
}
