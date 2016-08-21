import React, {Component, PropTypes} from 'react';
import DropZone from '../../components/ImageUpload/DropZone';
// import util from 'util';

export default class PostForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    postId: PropTypes.string,
    images: PropTypes.any,
    submitHandler: PropTypes.func.isRequired,
    uploadFileHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const initialValues = this.props.initialValues ? this.props.initialValues : { images: []};
    this.state = {title: initialValues.title, body: initialValues.body, images: initialValues.images };
  }

  handleTitleChange(event) {
    this.setState({'title': event.target.value});
  }

  handleBodyChange(event) {
    this.setState({body: event.target.value});
  }

  handleImagesChange(images) {
    this.setState({images: images});
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.state.title.trim();
    const body = this.state.body.trim();
    const images = this.state.images.map((image) => {return image.uploadedUrl;}).join(', ');
    const {submitHandler} = this.props;
    if (!title || !body) {
      console.warn('both post title and body are blank');
      return;
    }
    submitHandler({title, body, images});
    this.setState({title: '', body: '', images: []});
  }

  render() {
    const {postId, uploadFileHandler } = this.props;
    const {title, body, images } = this.state;
    const styles = require('./PostForm.scss');
    return (
      <form id={`postForm_${postId}`} key={postId} className={styles.postForm} onSubmit={(event) => { this.handleSubmit(event); }}>
        <div>
          <input
            type="text"
            placeholder="Title of your post ..."
            value={title}
            onChange={(event) => { this.handleTitleChange(event); } }
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Body of your post ..."
            value={body}
            onChange={(event) => { this.handleBodyChange(event); }}
          />
          <DropZone images={images} uploadImageHandler={uploadFileHandler} onChangeHandler={(event) => { this.handleImagesChange(event); }} />
        </div>
        <input type="submit" value="Post"/>
      </form>
    );
  }
}
