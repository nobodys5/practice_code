import React from 'react'

interface Props {
  title: string;
  content: string;
};

function Testcontent({title, content}: Props) {


    return (
      <div>
        <h1>{title}</h1>
        <h1>{content}</h1>
      </div>
    )
  }


export default function ComponentTest() {
  return (
    <div>
      <Testcontent title='제목' content='홍길이' />
    </div>
  )
}
