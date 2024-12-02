import React, { ChangeEvent, Component, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import ComponentTest from './ComponentTest';
import { on } from 'events';
import { Route, Routes, } from 'react-router-dom';
import axios from "axios";
import { error } from 'console';
import { Url } from 'url';



function App() {
  
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [ispasswordMessage, setIsPasswordMessage] = useState<boolean>(false);

  const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8~13}$/
    const isSucced = pattern.test(value);
    setPassword(value); 

    const test = (isSucced || !value) ? '하이' : '비밀번호를 입력해주세요';
    setPasswordMessage(test);
    setIsPasswordMessage(isSucced);
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
      <SigninComponent message={passwordMessage} onchange={onPasswordChangeHandler} value={password} />    
    </div>
  );
}
interface Props {
  message:string
  onchange: (event:ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export function SigninComponent ({message, onchange, value}: Props) {
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
      <div className='name'>
      <label>이름</label>
      </div>
      <input placeholder='이름을 입력해주세요' type='text' value={name} onChange={onNameChangeHandler}/>
      <div>
      <label>아이디</label>
      </div>
      <input placeholder='아이디를 입력해주세요' type='text' value={id} onChange={onIdChangeHandler}/>
      <div>
      <label>비밀번호</label>
      </div>
      <input placeholder='비밀번호를 입력해주세요' type='text' value={password} onChange={onPasswordChangeHandler}/>
      <div>{passwordMessage}</div>
      <div>
      <label>전화번호</label>
      </div>
      <input placeholder='전화번호를 입력해주세요' type='text' value={telNumber} onChange={onTelNumberChangeHandler}/>
      <div>{telNumberMessage}</div>
      <button>인증버튼</button>
    </div>
  )
}
export default App;

