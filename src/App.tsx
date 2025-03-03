import React, { ChangeEvent, Component, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import ComponentTest from './ComponentTest';
import { on } from 'events';
import { Route, Routes, useNavigate, useSearchParams, } from 'react-router-dom';
import axios from "axios";
import { error } from 'console';
import { Url } from 'url';
import userEvent from '@testing-library/user-event';
import { Cookies, useCookies } from 'react-cookie';
import { tab } from '@testing-library/user-event/dist/tab';
import MainLayout from './layouts/MainLayout';
import path, { join } from 'path';
import { ACCESS_TOKEN, AUTH_APSOLUTE_PATH, AUTH_PATH, CS_APSOLUTE_PATH, CS_DETAIL_PATH, CS_PATH, CS_UPDATE_PATH, CS_WRITE_PATH, HR_PATH, MM_PATH, ROOT_PATH, SNS_SUCCESS_PATH } from './constants';
import CS from './views/CS';
import { write } from 'fs';
import CSWrite from './views/Write';
import CSDetail from './views/Detail';
import IdCheckRequestDto from './apis/dto/request/auth/id-check.request.dto';
import { getsignInRequest, IdCheckRequest, signInRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from './apis';
import { ResponseDto } from './apis/dto/response';
import { SignInRequestDto, SignUPRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from './apis/dto/request/auth';
import { SignInResponseDto } from './apis/dto/response/auth';
import { GetSignInResponseDto } from './apis/dto/response/nurse';
import { useSignInUserStore } from './stores';

type AuthPath = 'sign-in' | 'sign-up';


// component: Sns success 컴포넌트 //
function SnsSuccess() {

  // state: Query Parameter 상태 //
  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  // state : cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();
  // effect: Sns Success 컴포넌트 로드시 accessToken과 expiration을 확인하여 로그인 처리 함수//
  useEffect(() => {
    if (accessToken && expiration) {
        const expires = new Date(Date.now() + (Number(expiration) + 10));
        setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires});

        navigator(CS_APSOLUTE_PATH);
    } 
    else navigator(AUTH_APSOLUTE_PATH);
    
  }, []);
  return(
    <></>
  )
}
function SnSContainer () {
   // event handler: SNS 버튼 클릭 이벤트 처리 //
   const onSnsButtonClickHandler = (sns: 'kakao' | 'naver') => {
    window.location.href = `http://localhost:4040/api/v1/auth/sns-sign-in/${sns}`;
  }

  
  return (
    <div className='sns-box'>
      <div className='kakao' onClick={() => onSnsButtonClickHandler('kakao')}>카카오</div>
      <div className='naver' onClick={() => onSnsButtonClickHandler('naver')}>네이버</div>
    </div>
  )
}

function Signup({onPathChange}: changeProps) {
  
  const [queryParam] = useSearchParams();
  const snsId = queryParam.get('snsId');
  const joinPath = queryParam.get('joinPath');

  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordPass, setPasswordPass] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');


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
  const [isAuthSend, setAuthSend] = useState<boolean>(false);
  
  const isSnsSignup = snsId !== null && joinPath !== null;

  const idCheckResponse = (responseBody: ResponseDto | null) => {

    const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
     responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
     responseBody.code === 'DI' ? '이미 사용중인인 아이디입니다.' :
     responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
     responseBody.code === 'SU' ? '사용 가능한 아이디 입니다.' : '';
     
     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
     setIdMessage(message);
     setIsIdMessage(!isSuccessed);
     setIdMatched(isSuccessed);
     console.log(message)
   }; 

  const telAuthResponse = (responseBody: ResponseDto | null) => {

    const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
     responseBody.code === 'VF' ? '숫자 11자리 입력해주세요.' :
     responseBody.code === 'DT' ? '이미 사용중인 전화번호입니다.' :
     responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
     responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
     responseBody.code === 'SU' ? '사용 가능한 전화번호 입니다.' : '';
     
     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
     setTelNumberMessage(message);
     setIsTelNumberMessage(!isSuccessed);
     setSend(isSuccessed);
   }; 

  const telAuthCheckResponse = (responseBody: ResponseDto | null) => {

    const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
     responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
     responseBody.code === 'TAF' ? '인증번호를 정확하게 입력해주세요.' :
     responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
     responseBody.code === 'SU' ? '전화번호 인증 완료.' : '';
     
     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
     setAuthNumberMessage(message);
     setIsAuthNumberMessage(!isSuccessed);
     setAuthSend(isSuccessed);
   }; 
  const SignupResponse = (responseBody: ResponseDto | null) => {

    const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
     responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
     responseBody.code === 'DI' ? '중복된 아이디 입니다.' :
     responseBody.code === 'DT' ? '중복된 전화번호 입니다.' :
     responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
     responseBody.code === 'SU' ? '회원가입 완료.' : '';
     
     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
    if (!isSuccessed) {
      alert(message);
      return;
    }
     onPathChange('sign-in');
   }; 

  const [isPasswordMatched, setPasswordMatched] = useState<boolean>(false);
  const [isIdMatched, setIdMatched] = useState<boolean>(false);
  const isComplete = isAuthSend && id && password && passwordPass && telNumber &&
    isSend && isPasswordMatched && isIdMatched && name && authNumber ;
  

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
      setIdMessage("숫자,영문 포함 4~8자리 이내로 입력하세요.");
      setIsIdMessage(true);
      return
    }
    
    const requestBody :IdCheckRequestDto = {
      userId: id
    };
    IdCheckRequest(requestBody).then(idCheckResponse);
   
    // const isDuplicated = id === 'qwer1234';
    // if (isDuplicated) {
    //   setIdMessage('이미 사용중인 아이디입니다.');
    //   setIsIdMessage(true)
    //   setIdMatched(false);
    //   return;
    // }
  
    // setIdMessage('사용 가능한 아이디입니다.');
    // setIsIdMessage(false);
    // setIdMatched(true);
  }

  const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value); 
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
    const isSucced = pattern.test(value);
    

    
    const test = (isSucced || !value) ? '' : '8~13자리 영문,숫자 포함 입력하세요.';
    setPasswordMessage(test);
    setIsPasswordMessage(!isSucced);

    
    
  }
  const onPasswordPassChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {

    const { value } = event.target;
    setPasswordPass(value); 
   
    if (!value) {
      setPasswordPassMessage('');
      return;
    }
  }

  const onTelNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value); 
    setSend(false);
    setTelNumberMessage('');
    setAuthNumber('');
  };

  const onClickTelNumberHandler = () => {
    if (!telNumber) return;
    
    const pattern = /^[0-9]{11}$/;
    const isMatched = pattern.test(telNumber);

    
    if (!isMatched) {
      setTelNumberMessage('11자리 이내 숫자로 입력해주세요.')
      setIsTelNumberMessage(true);
      return;
    }; 
    
    const requestBody : TelAuthRequestDto = { telNumber };
    telAuthRequest(requestBody).then(telAuthResponse);
    // setTelNumberMessage('인증번호 전송');
    // setIsTelNumberMessage(false);
    // setSend(true);
    
  }

  const onAuthNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    
    setAuthNumber(value); 
    if (!value) {
      setAuthNumberMessage('');
      return;
    } 

    
  }
  const onAuthNumberClickHandler = () => {
    if (!authNumber) return;

    // const isMatched = authNumber === '1234'
    
    // if (!isMatched) {
    //   setAuthNumberMessage('인증번호를 정확하게 입력해주세요.');
    //   setIsAuthNumberMessage(true);
    //   return;
    // }

    const requestBody: TelAuthCheckRequestDto ={
      telNumber,
      authNumber
    }
    telAuthCheckRequest(requestBody).then(telAuthCheckResponse);

    // setAuthNumberMessage('인증번호 확인');
    // setIsAuthNumberMessage(false);
    // setAuthSend(true);
  }

  const onSignupClickHandler = () => {
    if (!isComplete) return;

  const requestBody: SignUPRequestDto = {
    name,
    userId: id,
    password,
    telNumber,
    authNumber,
    joinPath: joinPath ? joinPath : 'home',
    snsId
  }
   signUpRequest(requestBody).then(SignupResponse);
    
  }

  useEffect(() => {
    if (!password || !passwordPass) return; 

    
    const isMatched = password === passwordPass;
    const test = isMatched ? '' : '비밀번호가 일치하지 않습니다.';

    setPasswordPassMessage(test);
    setIsPasswordPassMessage(!isMatched);
    setPasswordMatched(isMatched);

  }, [password, passwordPass]);

  
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

      {!isSnsSignup && <SnSContainer/>}
      <SignupComponent  label='이름' type='text' placeholder='이름을 입력해주세요' message={''} messageError={isNameMessage} onchange={onNameChangeHandler} value={name} />    
      <SignupComponent  label='아이디' type='text' placeholder='아이디를 입력해주세요' message={idMessage} messageError={isidMessage} onchange={onIdChangeHandler} value={id} buttonName='중복확인' onClick={onIdClickHandler}/>    
      <SignupComponent  label='비밀번호' type='text' placeholder='비밀번호를 입력해주세요' message={passwordMessage} messageError={ispasswordMessage} onchange={onPasswordChangeHandler} value={password}/>    
      <SignupComponent  label='비밀번호 확인' type='text' placeholder='비밀번호를 입력해주세요' message={passwordPassMessage} messageError={ispasswordPassMessage} onchange={onPasswordPassChangeHandler} value={passwordPass}/>    
      <SignupComponent  label='전화번호' type='text' placeholder='전화번호를 입력해주세요' message={telNumberMessage} messageError={isTelNumberMessage} onchange={onTelNumberChangeHandler} value={telNumber} buttonName='인증번호' onClick={onClickTelNumberHandler}/>    
      {isSend && 
      <SignupComponent  label='인증번호' type='text' placeholder='인증번호를 입력해주세요' message={authNumberMessage} messageError={isAuthNumberMessage} onchange={onAuthNumberChangeHandler} value={authNumber} buttonName='인증확인' onClick={onAuthNumberClickHandler}/>    
      }

      <div className='signin-container'>
        <div className={`button ${isComplete ? 'primary' : 'disable'}`} onClick={onSignupClickHandler} style={{cursor:'pointer'}}>회원가입</div>
        <div className='sign-in' onClick={() => onPathChange('sign-in')} style={{cursor:'pointer'}}>로그인</div>
      </div>
      </div>
  );
}
interface SignupProps {
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


export function SignupComponent ({label, type, placeholder, message, messageError, buttonName, onchange,onClick, value}: SignupProps) {

 
  return(
    <div>
      <div>{label}</div>
      <div className='input-content'>
        <input value={value} type={type} placeholder={placeholder} onChange={onchange}></input>
        {buttonName && <div className={` ${value ? 'primary' : 'disable'}`} onClick={onClick}>{buttonName}</div>}
      </div>
      <div className={` ${messageError ? 'error' : 'primarysecond'}`}>{message}</div>
    </div>
  )
}


export function SignIn ({onPathChange}: changeProps) {
  const navigator = useNavigate();
  const [cookies, setCookies] = useCookies();
  const [name, setName] = useState<string>('accessToken');
  const [value, setValue] = useState<string>('cookie');

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [idmessage, setIdMessage] = useState<string>('');
  const [passwordmessage, setPasswordMessage] = useState<string>('');
  
  const [message, setMessage] = useState<string>('');

  const SignInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {

    const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
     responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
     responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다다.' :
     responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
     responseBody.code === 'TCF' ? '서버에 문제가 있습니다.' : '';
     
     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
     if (!isSuccessed) {
      setMessage(message);
      return;
     }
     const { accessToken, expiration } = responseBody as SignInResponseDto;
     const expires = new Date(Date.now() + (expiration * 1000));
     setCookies(ACCESS_TOKEN, accessToken, {path : ROOT_PATH, expires});

     navigator(CS_APSOLUTE_PATH);
   };

  const onIdChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
  }
  const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  }

  const onSignInButtonHandler = () => {
    if (!id || !password) return;
    
    const requestBody : SignInRequestDto = {
      userId : id,
      password
    }
    signInRequest(requestBody).then(SignInResponse);
    // if (id !== 'qwer1234') {
    //   setIdMessage('아이디가 일치하지 않습니다.');
    //   return;
    // } else if (password !== 'qwer1234') {
    //   setPasswordMessage('비밀번호가 일치하지 않습니다.');
    //   return;
    // }

    // alert('로그인 성공');
    // setCookies('accessToken' , {path : '/cs'});
    // navigator('/cs');
    
  }

  useEffect (() => {
    setIdMessage('');
    setPasswordMessage('');
  }, [id, password])  

  return(
    <div>
      <SignupComponent label='아이디' type='text' placeholder='아이디를 입력해주세요.' message={idmessage} messageError value={id} onchange={onIdChangeHandler}/>
      <SignupComponent label='비밀번호' type='text' placeholder='비밀번호를 입력해주세요.' message={passwordmessage} messageError value={password} onchange={onPasswordChangeHandler}/>
      <div className='signin-main'>
        <div className='signin-box' onClick={onSignInButtonHandler} style={{cursor:'pointer'}}>로그인</div>
        <div className='signup-box' onClick={() => onPathChange('sign-up')} style={{cursor:'pointer'}}>회원가입</div>
      </div>

        <SnSContainer/>
    </div>
  )
}

interface changeProps {
  onPathChange: (path: AuthPath) => void;
}
export default function Auth () { 

  const navigator = useNavigate();
  const [queryParam] = useSearchParams();
  const snsId = queryParam.get('snsId');
  const joinPath = queryParam.get('joinPath');
  const [path, setPath] = useState<AuthPath>('sign-in');

  const onPathChangeHandler = (path:AuthPath) => {
    setPath(path);
  }
  
  useEffect(() => {
    if (snsId && joinPath) setPath('sign-up');
      

  }, [])

  return (
    <div>
    {path === 'sign-in' ? 
    <SignIn onPathChange={onPathChangeHandler}/>
    :
    <Signup onPathChange={onPathChangeHandler}/> 
    }
    
   
    </div>
  )
}

export function Router() {
  const { signInUser, setSignInUser} = useSignInUserStore();

  const [Cookies, setCookie, removeCookie] = useCookies();
  const navigator = useNavigate();
  const getsignInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
      responseBody.code === 'NI' ? '로그인 유저 정보보가 존재하지 않습니다.' :
      responseBody.code === 'AF' ? '잘못된 접근입니다.' :
      responseBody.code === 'DBE' ? '로그인 우저 정보를 불러오는데 실패했습니다.' : ''
     const isSuccessed = responseBody !== null &&  responseBody.code === 'SU';

     if (!isSuccessed) {
      alert(message);
      removeCookie(ACCESS_TOKEN, {path : ROOT_PATH});
      setSignInUser(null);
      navigator(AUTH_APSOLUTE_PATH);
      return;
     }

     const { userId, name, telNumber } = responseBody as GetSignInResponseDto;
     setSignInUser({ userId, name, telNumber });
  }
  useEffect(() => {
    const accessToken = Cookies[ACCESS_TOKEN];
    if (accessToken)  getsignInRequest(accessToken).then(getsignInResponse);
    else setSignInUser(null);
    
  }, [Cookies[ACCESS_TOKEN]])
  
  return (
    <div>
       <Routes>
      <Route index element={<Index/>}></Route>
      <Route path={AUTH_PATH} element={<Auth/>}></Route>
      <Route path={CS_PATH} element={<MainLayout/>}>
        <Route index element={<CS />}></Route>
        <Route path={CS_WRITE_PATH} element={<CSWrite />}></Route>
        <Route path={CS_DETAIL_PATH(':customNumber')} element={<CSDetail/>}></Route>
        <Route path={CS_UPDATE_PATH(':customNumber')} element={<>고객 관리</>}></Route>
      </Route>
      <Route path={MM_PATH} element={<MainLayout/>}>
        <Route path='write' element={<>글 작성</>}></Route>
        <Route path=':customnumber' element={<>글 넘버</>}></Route>
        <Route path=':customnumber/update' element={<>글 수정</>}></Route>
      </Route>
      <Route path={HR_PATH} element={<MainLayout/>}>
        <Route path='write' element={<>글 작성</>}></Route>
        <Route path=':customnumber' element={<>글 넘버</>}></Route>
        <Route path=':customnumber/update' element={<>글 수정</>}></Route>
      </Route>
      <Route path={SNS_SUCCESS_PATH} element={<SnsSuccess/>}></Route>
      <Route path='*' element={<Index/>}></Route>
    </Routes>
    </div>
  )
}

export function Index () {
  const [cookies] = useCookies();

  const navigate = useNavigate();

  useEffect(() => {
    if(cookies[ACCESS_TOKEN]) navigate(CS_APSOLUTE_PATH);
    else navigate(AUTH_APSOLUTE_PATH);  
  }, []);
  return (
    <></>
  )
}


