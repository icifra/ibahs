import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export class GeminiTextChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsString()
  systemInstruction?: string;

  @IsOptional()
  @IsObject()
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };

  @IsOptional()
  @IsArray()
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;
}