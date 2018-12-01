import React, { Component } from "react";
import Link from "next/link";
import "./../style.scss";

class Blog extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="title">Hello, from Blog page</h1>

        <Link href="/">
          <a>Return to home page</a>
        </Link>
      </div>
    );
  }
}

export default Blog;
