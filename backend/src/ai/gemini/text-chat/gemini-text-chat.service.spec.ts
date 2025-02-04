import { Test, TestingModule } from '@nestjs/testing';
import { GeminiTextChatService } from './gemini-text-chat.service';

describe('GeminiTextChatService', () => {
  let service: GeminiTextChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiTextChatService],
    }).compile();

    service = module.get<GeminiTextChatService>(GeminiTextChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
