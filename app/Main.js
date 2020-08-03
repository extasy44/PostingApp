import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://saysay-posting-backend-api.herokuapp.com";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
const NotFound = React.lazy(() => import("./components/NotFound"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingIcon";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("appToken"),
      username: localStorage.getItem("appUsername"),
      avatar: localStorage.getItem("appAvatar"),
    },

    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  const mainReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessages":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
      default:
        return state;
    }
  };

  const [state, dispatch] = useImmerReducer(mainReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("appToken", state.user.token);
      localStorage.setItem("appUsername", state.user.username);
      localStorage.setItem("appAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("appToken");
      localStorage.removeItem("appUsername");
      localStorage.removeItem("appAvatar");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();

      const fetchResult = async () => {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: request.token }
          );

          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessages",
              value: "You session has expired. Please log in again",
            });
          }
        } catch (e) {
          console.log(e);
        }
      };
      fetchResult();
      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/create-post" exact>
                <CreatePost />
              </Route>
              <Route path="/aboutus" exact>
                <About />
              </Route>
              <Route path="/terms" exact>
                <Terms />
              </Route>
              <Route path="/feed" exact>
                <Home />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
