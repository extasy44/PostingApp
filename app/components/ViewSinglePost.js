import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, Link, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";

const ViewSinglePost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);
  let history = useHistory();
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token,
        });

        setPost(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPost();
    return () => {
      request.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  const deleteHandler = async () => {
    const confirm = window.confirm("Do you really want to delete this post?");

    if (confirm) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });

        if (response.data == "Success") {
          appDispatch({
            type: "flashMessages",
            value: "Post has been deleted",
          });

          history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              title="Delete"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
          ]}
        />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
