import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

// Определяет структуру данных для запроса к Gemini Text Chat API.
// Использует class-validator для автоматической валидации входящих данных.
export class GeminiTextChatRequestDto {
  // Сообщение пользователя, обязательное поле.
  @IsString()
  @IsNotEmpty()
  message: string;

  // Идентификатор модели Gemini, используемой для генерации ответа.
  // Например, "gemini-1.5-flash-latest". Обязательное поле.
  @IsString()
  @IsNotEmpty()
  model: string; 

  // Необязательная системная инструкция, задающая контекст или роль для модели.
  // Потенциальное улучшение: Рассмотреть возможность использования более сложного объекта для systemInstruction,
  // если потребуется передавать структурированные системные промпты.
  @IsOptional()
  @IsString()
  systemInstruction?: string;

  // Необязательные параметры конфигурации генерации ответа (температура, макс. токены и т.д.).
  // Структура этого объекта должна соответствовать GenerateContentConfig из Google GenAI SDK.
  // Потенциальное улучшение: Создать отдельный вложенный DTO для generationConfig для лучшей типизации
  // и возможности переиспользования.
  @IsOptional()
  @IsObject()
  generationConfig?: { 
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };

  // Необязательные настройки безопасности для контента.
  // Структура должна соответствовать SafetySetting из Google GenAI SDK.
  // Потенциальное улучшение: Аналогично generationConfig, создать вложенный DTO для элементов safetySettings
  // для строгой типизации { category: string; threshold: string; }.
  @IsOptional()
  @IsArray()
  safetySettings?: Array<{
    category: string; 
    threshold: string;
  }>;
}