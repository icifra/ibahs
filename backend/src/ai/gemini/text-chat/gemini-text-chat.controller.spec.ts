import { Test, TestingModule } from '@nestjs/testing';
import { GeminiTextChatController } from './gemini-text-chat.controller';

describe('GeminiTextChatController', () => {
  let controller: GeminiTextChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiTextChatController],
    }).compile();

    controller = module.get<GeminiTextChatController>(GeminiTextChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
