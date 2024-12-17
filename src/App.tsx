import React, { ChangeEvent, Component, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import ComponentTest from './ComponentTest';
import { on } from 'events';
import { Route, Routes, } from 'react-router-dom';
import axios from "axios";
import { error } from 'console';
import { Url } from 'url';



function App() {
  
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordPass, setPasswordPass] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');

  const [passwordCheck, setPasswordCheck] = useState<string>('');

  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordPassMessage, setPasswordPassMessage] = useState<string>('');
  const [telNumberMessage, setTelNumberMessage] = useState<string>('');
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

  const [isNameMessage, setIsNameMessage] = useState<boolean>(false);
  const [isidMessage, setIsIdMessage] = useState<boolean>(false);
  const [ispasswordMessage, setIsPasswordMessage] = useState<boolean>(false);
  const [ispasswordPassMessage, setIsPasswordPassMessage] = useState<boolean>(false);
  const [isTelNumberMessage, setIsTelNumberMessage] = useState<boolean>(false);
  const [isAuthNumberMessage, setIsAuthNumberMessage] = useState<boolean>(false);


  const [isSend, setSend] = useState<boolean>(false);

  const onNameChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value); 
  }

  const onIdChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
  setId(value);
  setIdMessage('');
  }
  const onIdClickHandler = () => {
    if (!id) return;
    
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,8}$/;
    const isSucced = pattern.test(id);
    
    if (!isSucced) {
      setIdMessage("숫자,영문 포함 8자리 이내로 입력하세요.");
      setIsIdMessage(true);
      return
    }

    const isDuplicated = id === 'qwer1234';
  
    const test = isDuplicated ? '이미 사용중인 아이디입니다.' : "사용 가능한 아이디입니다."
    setIdMessage(test);
    setIsIdMessage(isDuplicated);
  }

  const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value); 
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
    const isSucced = pattern.test(value);
    

    const test = (isSucced || !value) ? '' : '8~13자리 영문,특수문자 포함입력해주세요';
    setPasswordMessage(test);
    setIsPasswordMessage(!isSucced);
  }
  const onPasswordPassChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordPass(value); 
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
    const isSucced = pattern.test(value);

    const check = passwordPass === password;
    const test = (isSucced || check) ? '' : '비밀번호가 일치하지않습니다.';
    setPasswordPassMessage(test);
    setIsPasswordPassMessage(!isSucced);
  }

  const onTelNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value); 
    setSend(false);
    setTelNumberMessage('');
  };

  const onClickTelNumberHandler = () => {
    if (!telNumber) return;
    
    const pattern = /^[0-9]{11}$/;
    const isMatched = pattern.test(telNumber);

    if (!isMatched) {
      setTelNumberMessage('11자리 숫자로 입력해주세요.')
      setIsTelNumberMessage(true);
      return
    }; 

    setTelNumberMessage('인증번호 전송');
    setIsTelNumberMessage(false);
    setSend(true);
    
  }

  const onAuthNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value); 
    const pattern = /^(?=.*[0-9]).{4}$/;
    const isSucced = pattern.test(value);

    
    setIsAuthNumberMessage(!isSucced);
    setAuthNumberMessage('');
  }
  const onAuthNumberClickHandler = () => {
    const pattern = /^[0-9]{4}$/;
    const isSucced = pattern.test(authNumber);

    const isMatched = authNumber === '1234'
    
    const test = isMatched ? '인증번호 확인' : '인증번호를 정확하게 입력해주세요.';
    setAuthNumberMessage(test);
    setIsAuthNumberMessage(!isSucced);
    
  }

  
  // 위의 props 객체와 동일한 내용의 객체를 아래에서 선언하여 원본 복사
  // 스프레드 객체를 컴포넌트에서 복사해서 사용하여 깔끔한 코드 사용가능 
  const [url, setUrl] = useState<string>('');

  const kakaoRequest = async (requestBody: Url) => {
    const responseBody = await axios.post('https://open-api.kakaopay.com/online/v1/payment/ready', {"cid": "TC0ONETIME",
		"partner_order_id": "partner_order_id",
		"partner_user_id": "partner_user_id",
		"item_name": "초코파이",
		"quantity": "1",
		"total_amount": "2200",
		"vat_amount": "200",
		"tax_free_amount": "0",
		"approval_url": "https://developers.kakao.com/success",
		"fail_url": "https://developers.kakao.com/fail",
		"cancel_url": "https://developers.kakao.com/cancel"}, { headers : {'Authorization':'SECRET_KEY DEV5589617CA1193984A40BBA2990D1AB4584810','Content-Type':'application/json' }})
        .then((response) => {console.log(response.data)})
        .catch((error) => {console.log(error)});
    return responseBody;
};

  const onClickKaKaoTestHandler = () => {
    const requestBody: Url = {
      auth: null,
      hash: null,
      host: null,
      hostname: null,
      href: '',
      path: null,
      pathname: null,
      protocol: null,
      search: null,
      slashes: null,
      port: null,
      query: null
    };

    
    kakaoRequest(requestBody);
    console.log(onClickKaKaoTestHandler);
  }
  
  return (
    <div>
      <SigninComponent  label='이름' type='text' placeholder='이름을 입력해주세요' message={''} messageError={isNameMessage} onchange={onNameChangeHandler} value={name} />    
      <SigninComponent  label='아이디' type='text' placeholder='아이디를 입력해주세요' message={idMessage} messageError={isidMessage} onchange={onIdChangeHandler} value={id} buttonName='중복확인' onClick={onIdClickHandler}/>    
      <SigninComponent  label='비밀번호' type='text' placeholder='비밀번호를 입력해주세요' message={passwordMessage} messageError={ispasswordMessage} onchange={onPasswordChangeHandler} value={password}/>    
      <SigninComponent  label='비밀번호 확인' type='text' placeholder='비밀번호를 입력해주세요' message={passwordPassMessage} messageError={ispasswordPassMessage} onchange={onPasswordPassChangeHandler} value={passwordPass}/>    
      <SigninComponent  label='전화번호' type='text' placeholder='전화번호를 입력해주세요' message={telNumberMessage} messageError={isTelNumberMessage} onchange={onTelNumberChangeHandler} value={telNumber} buttonName='전화번호 인증' onClick={onClickTelNumberHandler}/>    
      {isSend && 
      <SigninComponent  label='인증번호' type='text' placeholder='인증번호를 입력해주세요' message={authNumberMessage} messageError={isAuthNumberMessage} onchange={onAuthNumberChangeHandler} value={authNumber} buttonName='인증번호' onClick={onAuthNumberClickHandler}/>    
      }

      <button>회원가입</button>
      </div>
  );
}
interface Props {
  label: string;
  type: 'text' | 'password';
  placeholder:string;
  message:string;
  messageError:boolean;
  buttonName?:string;
  onchange: (event:ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  value: string;
}

export function SigninComponent ({label, type, placeholder, message, messageError, buttonName, onchange,onClick, value}: Props) {
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [idCheck, setIdCheck] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [ispasswordMessage, setIsPasswordMessage] = useState<boolean>(false);
  
  const [telNumber, setTelNumber] = useState<string>('');
  const [telNumberMessage, setTelNumberMessage] = useState<string>('');
  const [isTelNumberMessage, setIsTelNumberMessage] = useState<boolean>(false);

  const onNameChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value); 
  }
  const onIdChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    setIdCheck(idCheck);
    setId(value); 
  }
  const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8~13}$/
    const isSucced = pattern.test(value);
    setPassword(value); 

    const test = (isSucced || !value) ? '' : '8~13자리를 입력해주세요.';
    setPasswordMessage(test);
    setIsPasswordMessage(isSucced);
  }
  
  const onTelNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const pattern = /^(?=.*[0-9]).{11}$/
    const isSucced = pattern.test(value);
    setTelNumber(value); 

    const test = (isSucced || !value) ? '' : '중복된 전화번호입니다.';
    setTelNumberMessage(test);
    setIsTelNumberMessage(isSucced);
  }
  return(
    <div>
      <div>{label}</div>
      <div className='input-content'>
        <input value={value} type={type} placeholder={placeholder} onChange={onchange}></input>
        {buttonName && <div className={` ${value ? 'primary' : 'disable'}`} onClick={onClick}></div>}
      </div>
      <div className={` ${messageError ? 'error' : 'primarysecond'}`}>{message}</div>
    </div>
  )
}
export default App;

