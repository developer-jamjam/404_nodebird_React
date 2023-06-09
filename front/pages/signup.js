import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { Button, Checkbox, Form, Input } from "antd";
import React,{ useCallback, useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import Router from 'next/router'
import Swal from 'sweetalert2';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading , signUpDone, signUpError,me} = useSelector((state)=>state.user);

  useEffect(()=>{
    if (me && me.id) {
      Router.replace('/');
    }
  },[me && me.id])

  useEffect(()=> {
    if(signUpDone) {
      Router.replace('/');
    }
  },[signUpDone]);

  useEffect(()=> {
    if (signUpError) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: signUpError,
      });
    }
  },[signUpError]);
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {email, password, nickname}
    })
  }, [email, password, passwordCheck, term]);
  return (
    <>
      <AppLayout>
        <Head>
          <title>회원가입 | GongsaBird</title>
        </Head>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickname}
              onChange={onChangeNickname}
              required
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input
              name="user-password"
              type="password"
              value={password}
              required
              onChange={onChangePassword}
            />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호체크</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
              사공사의 공사버드에 가입하시는 것을 동의 하십니까?
            </Checkbox>
            {termError && (
              <ErrorMessage>동의하지 않으면 가입할 수 없어요</ErrorMessage>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
