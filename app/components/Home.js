import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import Page from "./Page";
import Post from "./Post";
import StateContext from "../StateContext";
import LoadingDotsIcon from "./LoadingIcon";

const Home = () => {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const request = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await Axios.post(
          "/getHomeFeed",
          { token: appState.user.token },
          { cancelToken: request.token }
        );

        setState((draft) => {
          draft.feed = response.data;
          draft.isLoading = false;
        });
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchData();
    return () => {
      request.cancel();
    };
  }, []);

  if (state.isLoading) {
    <LoadingDotsIcon />;
  }

  return (
    <Page title="Welcome to SaySay">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">
            The latests feeds from your followers
          </h2>
          <div className="list-group">
            {state.feed.map((post) => {
              return <Post key={post._id} post={post} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <div className="col-lg-12 py-3 py-md-5">
          <h2 className="display-5">
            Hello <strong>{appState.user.username}</strong>, your feed is empty
          </h2>
          <p className="lead text-muted">
            Your feed desplays the latest posts from the people you follow. If
            you don't have any friends to follow that's ok, you can use the
            "Search" feature in the top menu bar to find content written by
            people with similar interests and then follow them
          </p>
        </div>
      )}
    </Page>
  );
};

export default Home;
