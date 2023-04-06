import React from 'react';
import { Avatar, Button, Card } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me , logOutLoading } = useSelector((state)=> state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  },[]);

  const logOutStyle = useMemo(() => ({ marginLeft: 40, marginTop: 5 }), []);

  return (
    <>
      <Card
        actions={[
          <div key="twit">
            <Link href={`/user/${me.id}`}><a>
              꽥꽥
              <br /> {me.Posts.length}
            </a></Link>
          </div>,
          <div key="followings">
            <Link href={`/profile`}><a>
              팔로잉
              <br /> {me.Followings.length}
            </a></Link>
          </div>,
          <div key="followings">
            <Link href={`/profile`}><a>
              팔로워
              <br /> {me.Followers.length}
            </a></Link>
          </div>,
        ]}
      >
        <Card.Meta 
          avatar={(
            <Link href={`/user/${me.id}`}>
              <a><Avatar>{me.nickname[0]}</Avatar></a>
            </Link>)} 
          title={me.nickname} 
        />
        <Button onClick={onLogOut} style={logOutStyle} loading={logOutLoading}>
          로그아웃
        </Button>
      </Card>
    </>
  );
};

export default UserProfile;
