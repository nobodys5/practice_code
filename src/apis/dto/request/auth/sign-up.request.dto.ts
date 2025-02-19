export interface SignUPRequestDto {
    name : string;
    userId : string;
    password : string;
    telNumber : string;
    authNumber : string;
    joinPath : string;
    snsId? : string;
}