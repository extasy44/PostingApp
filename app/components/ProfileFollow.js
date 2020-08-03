import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";

import LoadingIcon from "./LoadingIcon";

const ProfileFollowers = ({ action, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    fetchData();
    return () => {
      request.cancel();
    };
  }, [username, action]);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`/profile/${username}/${action}`);

      setPosts(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) return <LoadingIcon />;

  const Render = () => {
    if (posts.length > 0) {
      return <Follow />;
    } else if (username != user && action == "followers") {
      return <div>This user does not have any followers</div>;
    } else if (username != user && action == "following") {
      return <div>This user does not follow any user</div>;
    } else if (username == user && action == "following") {
      return <div>You do not follow any user</div>;
    } else if (username == user && action == "followers") {
      return <div>You do not have any follower</div>;
    }
  };

  const Follow = () => {
    return posts.map((follower, index) => {
      return (
        <Link
          key={index}
          to={`/profile/${follower.username}`}
          className="list-group-item list-group-item-action"
        >
          <img className="avatar-tiny" src={follower.avatar} />
          {follower.username}
        </Link>
      );
    });
  };

  return (
    <div className="list-group">
      <Render />
    </div>
  );
};

export default ProfileFollowers;
