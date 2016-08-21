import React, {Component, PropTypes} from 'react';
import Avatar from '../Avatar';
import PostForm from '../PostForm/PostForm';
import * as newPostActions from 'redux/actions/postsActionCreators';
import * as newCommentActions from 'redux/actions/commentActionCreators';
import {connect} from 'react-redux';
import CommentForm from '../Comment/CommentForm';
import Thumbnail from '../Thumbnail/Thumbnail';
// import util from 'util';

const icon1 = require( './images/icon1.jpg' );
const icon4 = require( './images/icon4.jpg' );
const styles = require( './Post.scss' );

@connect(
  () => ({

  }), {...newPostActions, ...newCommentActions} )

export default class Post extends Component {
  static propTypes = {
    children: PropTypes.string,
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    images: PropTypes.array,
    comments: PropTypes.any,
    createdAt: PropTypes.string,
    editing: PropTypes.bool,
    deletePost: PropTypes.func.isRequired,
    createNewComment: PropTypes.func.isRequired,
    editPostStart: PropTypes.func.isRequired,
    editPost: PropTypes.func.isRequired,
    editPostStop: PropTypes.func.isRequired
  };

  render() {
    const {children, editing, id, title, createdAt, images, editPost, editPostStart, editPostStop, deletePost, createNewComment, comments } = this.props;
    return (
      <li id={`post_${String(id)}`} className={styles.post}>
        { editing &&
        <div>
          <PostForm initialValues={this.props} submitHandler={editPost} />
          <a href="#" onClick={(event) => { event.preventDefault(); editPostStop(id); }}>Cancel</a>
        </div>
        }
        { !editing &&
        <div className="post">
          <div>
            <a href="#" onClick={(event) => { event.preventDefault(); deletePost(id); }}>Delete</a>
            <a href="#" onClick={(event) => { event.preventDefault(); editPostStart(id); }}>Edit</a>
            <div className={styles.userinfo + ' pull-left'}>
              <Avatar />

              <div className={styles.icons}>
                <img src={icon1} alt=""/>
                <img src={icon4} alt=""/>
              </div>
            </div>
            <div className={styles.posttext + ' pull-left'}>
              <h2>
                <a href="$"> {title}</a></h2>
              <p>{children}</p>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className={styles.postminfo + ' pull-left'}>
            <div className={styles.coments}>
              <div className={styles.commentbg}>
                560
                <div className={styles.mark}></div>
              </div>

            </div>
            <div className={styles.views}><i className="fa fa-eye"></i> 25</div>
            <div className={styles.time}><i className="fa fa-clock-o"></i> {createdAt}</div>
          </div>
          <div>
            { images && images.map((postImg) => {
              return (<Thumbnail key={postImg.preview} image={postImg} thumbwidthHeight="100px" />);
            })}
          </div>
          <div>
            { comments && comments.map( (comment) => {
              return (<div key={comment.id}>{comment.body}</div>);
            })}
            <CommentForm createCommentHandler={createNewComment} postId={id} />
          </div>
        </div>
        }
        <div className="clearfix"></div>
      </li>
    );
  }
}
