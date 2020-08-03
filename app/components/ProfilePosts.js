import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";

import LoadingIcon from "./LoadingIcon";
import Post from "./Post";
import StateContext from "../StateContext";

const ProfilePosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    fetchData();
    return () => {
      request.cancel();
    };
  }, [username]);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`/profile/${username}/posts`);

      setPosts(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post post={post} key={post._id} noAuthor={true} />;
      })}
    </div>
  );
};

export default ProfilePosts;
