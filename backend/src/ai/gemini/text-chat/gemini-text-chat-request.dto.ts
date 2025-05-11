import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

export class GeminiTextChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  model: string; // Например, "gemini-1.5-flash-latest" или "gemini-2.0-flash"

  @IsOptional()
  @IsString()
  systemInstruction?: string;

  @IsOptional()
  @IsObject()
  // Поля здесь должны соответствовать тому, что ожидает GenerateContentConfig SDK
  // для параметров генерации (temperature, topP, topK, maxOutputTokens, stopSequences, candidateCount и т.д.)
  generationConfig?: { 
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
    // candidateCount?: number; // Если поддерживается и нужно
  };

  @IsOptional()
  @IsArray()
  // Структура должна соответствовать типу SafetySetting из SDK
  // SafetySetting обычно { category: string; threshold: string; }
  safetySettings?: Array<{
    category: string; 
    threshold: string;
  }>;
}