import React from 'react';
import axios from 'axios';
import Post from './Post';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    axios
      .get(`http://localhost:5000/users/${id}/posts`)
      .then(res => this.setState({ posts: res.data.posts }))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div>
        {this.state.posts.map(post => (
          <Post key={post.id} data={post} />
        ))}
      </div>
    );
  }
}

export default User;
