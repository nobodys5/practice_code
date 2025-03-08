import { Tool } from "../../../../types";
import ResponseDto from "../response.dto";

export default interface GetToolResponseDto extends ResponseDto {
    tools: Tool[];
}