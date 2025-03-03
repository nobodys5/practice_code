import ResponseDto from "../response.dto";

export default interface GetSignInResponseDto extends ResponseDto {
    userId : string;
    name : string;
    telNumber : string;
}