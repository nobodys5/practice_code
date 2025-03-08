import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import { GetToolListRequest, PostToolRequest } from '../../apis';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../constants';
import { PostToolRequestDto } from '../../apis/dto/request/tool';
import { ResponseDto } from '../../apis/dto/response';
import { GetToolResponseDto } from '../../apis/dto/response/tool';

interface unShowPostBox {
  unshow : () => void;
}

function PostBox({unshow}: unShowPostBox) {
  const [name, setName] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [count, setCount] = useState<string>('');
  const [cookies] = useCookies();

  const onNameChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  }
  const onPurposeChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPurpose(value);
  }
  const onCountChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regexp = /^[0-9]*$/;
    const isNumber = regexp.test(value);
    if (!isNumber) return;
    setCount(value);
  }
  const PostToolResponse = (responseBody: ResponseDto | null) => {
    const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

     const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
          alert(message);
          return;
        } 

        unshow();
  }

  const onPostClickHandler = () => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;

    if (!name || !purpose || !count) {
     alert('모두 입력해주세요.');
     return; 
    }
    const requestBody : PostToolRequestDto = {
      name, purpose, count : Number(count)
    };

    PostToolRequest(requestBody, accessToken).then(PostToolResponse);
  }
  return (
    <div className='post-box'>
        <div className='post-patch-input-container'>
        <div className='input-box'>
          <div className='input-label'>용품명</div>
          <input className='input' value={name} placeholder='용품명을 입력해주세요.' onChange={onNameChangeHandler}></input>
        </div>
        <div className='input-box' style={{flex:1}}>
          <div className='input-label'>용도</div>
          <input className='input' value={purpose} placeholder='용도를 입력해주세요.' onChange={onPurposeChangeHandler}></input>
        </div>
        <div className='input-box'>
          <div className='input-label'>개수</div>
          <input className='input' value={count} placeholder='개수를 입력해주세요.' onChange={onCountChangeHandler}></input>
        </div>
      </div>
      <div className='primary' onClick={onPostClickHandler}>등록</div>
      <div className='disable' onClick={unshow}>취소</div>
    </div>
  )
}
function PatchBox() {
  return (
    <div className='post-patch-box'>
      <div className='post-patch-input-container'>
        <div className='input-box'>
          <div className='input-label'>용품명</div>
          <input className='input' placeholder='용품명을 입력해주세요.'></input>
        </div>
        <div className='input-box' style={{flex:1}}>
          <div className='input-label'>용도</div>
          <input className='input' placeholder='용도를 입력해주세요.'></input>
        </div>
        <div className='input-box'>
          <div className='input-label'>개수</div>
          <input className='input' placeholder='개수를 입력해주세요.'></input>
        </div>
      </div>
      <div className='primary'>수정</div>
      <div className='disable'>취소</div>
    </div>
  )
}

export default function MM() {
  const [showPostBox, setShowPostBox] = useState<boolean>(false);
  const [showPatchBox, setShowPatchBox] = useState<boolean>(false);
  const unShowPostBox = () => setShowPostBox(false);
  const [cookies] = useCookies();

  const onPostButtonClickHandler = () => {
    setShowPostBox(true);
    setShowPatchBox(false);
    console.log(showPostBox);
  }
  const GetToolResponse = (responseBody : GetToolResponseDto | ResponseDto | null) => {
    const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '모두 입력해주세요.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      return;
    }     
  }

  useEffect(() => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) return;
    GetToolListRequest(accessToken).then(GetToolResponse)
  }, [])

  return (
    <div id='mm-wrapper'>
        {showPostBox && <PostBox unshow={unShowPostBox}/>} 
        {showPatchBox && <PatchBox/>}
        <div className='top'>
          <div className='top-text'>전체 <span className='emphasis'>150건</span> | 페이지 <span className='emphasis'>1/100</span></div>
          {!showPostBox && !showPatchBox && <div className='primary' onClick={onPostButtonClickHandler}>등록</div>}
          
        </div>
        <div className='main'></div>
        <div className='bottom'></div>
    </div>
  )
}
