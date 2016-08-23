import React, {Component, PropTypes} from 'react';
import Post from '../../components/Post/Post';
import Sidebar from '../../components/Sidebar';
import NewPostForm from '../../components/PostForm/NewPostForm';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import * as newPostActions from 'redux/actions/postsActionCreators';
import { loadUsers } from 'redux/actions/usersActionCreators';
import lodash from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

@asyncConnect( [{
  deferred: false,
  promise: ({store}) => {
    if (!newPostActions.isLoaded( store.getState() )) {
      return store.dispatch( newPostActions.loadPosts() ).then(({data: {posts}}) => {
        const postCreatorIds = lodash(posts)
          .filter(post => post.createdBy !== null)
          .map(post => post.createdBy)
          .uniqBy(post => post.createdBy)
          .value();

        return store.dispatch(loadUsers(postCreatorIds));
      });
    }
  }
}] )
@connect(
  state => ({
    currentUser: state.auth.user,
    users: state.users,
    posts: state.posts.data,
    hasMore: state.posts.hasMore,
    editing: state.posts.editing,
    loading: state.posts.loading,
    showNewPostForm: state.posts.newPost.show
  }),
  { ...newPostActions } )
export default class TimeLine extends Component {
  static propTypes = {
    users: PropTypes.object,
    posts: PropTypes.array,
    currentUser: PropTypes.object,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    showNewPostForm: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    loadPosts: PropTypes.func.isRequired,
    saveFile: PropTypes.func.isRequired,
    createNewPost: PropTypes.func.isRequired,
    toggleNewPostForm: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this._loadMorePosts = (page) => { this.loadMorePosts(page); };
  }


  loadMorePosts(page) {
    this.props.dispatch(this.props.loadPosts(page));
  }

  render() {
    const { users, currentUser, posts, editing, hasMore } = this.props;
    const styles = require( './Events.scss' );
    console.log(`render timeline`);
    return (
      <div className="container-fluid">
        <section className="pageContent">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-8">
                {currentUser &&
                <div className="row">
                  <NewPostForm {...this.props} />
                </div>
                }
                <ul className={styles.postsContainer}>
                  <InfiniteScroll
                    pageStart={1}
                    loadMore={this._loadMorePosts}
                    hasMore={hasMore}
                    loader={<div className="loader">Loading ...</div>}
                  >
                    { posts && posts.map( (post) => {
                      return (<Post {...this.props} postCreator={lodash.find(users.data, (postUser) => { return postUser.id === post.createdBy; })} {...post} editing={editing[post.id]} key={post.id} />);
                    })}
                  </InfiniteScroll>
                </ul>
              </div>
              <div className="col-lg-4 col-md-4">
                <Sidebar />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
