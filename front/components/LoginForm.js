import React, { useEffect } from 'react';
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { loginRequestAction } from '../reducers/user';
import Swal from 'sweetalert2';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError} = useSelector((state)=>state.user);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  useEffect(()=> {
    if (logInError) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: logInError,
      });
    }
  },[logInError])

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({email,password}));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a><Button>회원가입</Button></a>
        </Link>
      </ButtonWrapper>
      <div></div>
    </FormWrapper>
  );
};

export default LoginForm;
