import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import './style.css'
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, AUTH_APSOLUTE_PATH, CS_APSOLUTE_PATH, CS_PATH, HR_APSOLUTE_PATH, HR_PATH, MM_APSOLUTE_PATH, MM_PATH, ROOT_APSOLUTE_PATH } from '../constants';

function Logo() {
  return(
    <div id='logo-layout'>시니케어</div>
  )
} 

function Top() {
  // state: 경로 상태 표시 //
  const {pathname} = useLocation();
  
  // state: 쿠키 상태 표시 //
  const [cookies, setCookies, removeCookies] = useCookies();

  const navigator = useNavigate();

  // variable: 경로 url 위치 지정 //
  const path = 
  pathname.startsWith(CS_PATH) ? '고객 관리' :
  pathname.startsWith(MM_PATH) ? '용품 관리' :
  pathname.startsWith(HR_PATH) ? '인사 관리' : '';



  const onSignoutButtonHandler = () => {
    removeCookies(ACCESS_TOKEN, { path: ROOT_APSOLUTE_PATH });
    navigator(AUTH_APSOLUTE_PATH);
  }
  return(
    <div id='top-layout'>
      <div>{path}</div>
      <div className='signout' onClick={onSignoutButtonHandler}>로그아웃</div>
    </div>
  )
} 
function LeftNavigation() {
  const {pathname} = useLocation();

  const navigator = useNavigate();

  const isCS = pathname.startsWith(CS_PATH);
  const isMM = pathname.startsWith(MM_PATH);
  const isHR = pathname.startsWith(HR_PATH);

  const onClickPathMoveHandler = (path: string) => {
    navigator(path);
  }
  return(
    <div id='left-layout'>
      <div className={`navigation ${isCS ? 'active' : ''}`} onClick={() => onClickPathMoveHandler(CS_APSOLUTE_PATH)}>
        <div className='icon'></div>
        <div className='left-text'>고객 관리</div>
      </div>
      <div className={`navigation ${isMM ? 'active' : ''}`} onClick={() => onClickPathMoveHandler(MM_APSOLUTE_PATH)}>
        <div className='icon'></div>
        <div className='left-text'>용품 관리</div>
      </div>
      <div className={`navigation ${isHR ? 'active' : ''}`} onClick={() => onClickPathMoveHandler(HR_APSOLUTE_PATH)}>
        <div className='icon'></div>
        <div className='left-text'>인사 관리</div>
      </div>
    </div>
  )
} 

export default function MainLayout() {
  const [cookies] = useCookies();
  const navigator = useNavigate();

  useEffect(()=> {
    if (!cookies[ACCESS_TOKEN]) navigator(AUTH_APSOLUTE_PATH);
  },[])
  return (
    <div id='main-layout'>
        고객 리스트 보기
        <Logo></Logo>
        <Top></Top>
        <LeftNavigation></LeftNavigation>
        <div id='main-wrapper'>
          <Outlet/>
        </div>
    </div>
  )
}
