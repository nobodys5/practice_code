import React, { ChangeEvent, Component, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import ComponentTest from './ComponentTest';
import { on } from 'events';
import { Route, Routes, } from 'react-router-dom';
import axios from "axios";
import { error } from 'console';
import { Url } from 'url';



function App() {
  

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
      <div>테스트용
        <button onClick={onClickKaKaoTestHandler}>테스트</button>
      </div>
    
    </div>
  );
}

export default App;

