import axios, { AxiosResponse } from "axios"
import { ResponseDto } from "./dto/response"
import { IdCheckRequestDto, SignInRequestDto, SignUPRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth"
import { SignInResponseDto } from "./dto/response/auth";

// variable : API URL 상수
  const API_DOMAIN = 'http://localhost:4040';
  const AUTH_DOMAIN = `${API_DOMAIN}/auth`;

  const ID_CHECK_DOMAIN = `${AUTH_DOMAIN}/id-check`;
  const TEL_AUTH_DOMAIN = `${AUTH_DOMAIN}/tel-auth`;
  const TEL_AUTH_CHECK_DOMAIN = `${AUTH_DOMAIN}/telauth-check`;
  const SIGN_UP_DOMAIN = `${AUTH_DOMAIN}/signup-second`;
  const SIGN_IN_DOMAIN = `${AUTH_DOMAIN}/login`;

// function: response data 처리 함수 //
const responsedatahandler = <T>(response:AxiosResponse<T, any>) => {
        const {data} = response
        return data as ResponseDto;
}
const responseerrorhandler = <T>(error: any) => {
        if (!error.response) return null;
        const {data} = error.response;
        return data as ResponseDto;
}
// variable: axios 에러 handler
export const IdCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_DOMAIN, requestBody)
    .then(responsedatahandler)
    .catch(responseerrorhandler);
    return responseBody;
};

export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_DOMAIN, requestBody)
    .then(responsedatahandler)
    .catch(responseerrorhandler);
    return responseBody;
};

export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_DOMAIN, requestBody)
    .then(responsedatahandler)
    .catch(responseerrorhandler);
    return responseBody;
};
export const signUpRequest = async (requestBody: SignUPRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_DOMAIN, requestBody)
    .then(responsedatahandler)
    .catch(responseerrorhandler);
    return responseBody;
};
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_DOMAIN, requestBody)
    .then(responsedatahandler<SignInResponseDto>)
    .catch(responseerrorhandler);
    return responseBody;
};