import React from 'react';
import { Link } from 'react-router-dom';

const UserList = props => {
  return (
    <ul>
      {props.users.map(user => (
        <li key={user.id}>
          <Link to={`/user/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
