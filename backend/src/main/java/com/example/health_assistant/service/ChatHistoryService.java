package com.example.health_assistant.service;
import com.example.health_assistant.model.ChatHistory;
import com.example.health_assistant.model.User;
import com.example.health_assistant.repository.ChatHistoryRepository;
import com.example.health_assistant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatHistoryService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public void saveChat(Long userId, String userMessage, String botResponse) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUser(user);
        chatHistory.setUserMessage(userMessage);
        chatHistory.setBotResponse(botResponse);

        chatHistoryRepository.save(chatHistory);
    }

    public List<ChatHistory> getChatHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatHistoryRepository.findByUserOrderByCreatedAtAsc(user);
    }

    // Pass last 5 conversations to Gemini for context
    public String buildConversationContext(Long userId) {
        List<ChatHistory> history = getChatHistory(userId);

        int start = Math.max(0, history.size() - 5);
        List<ChatHistory> recentHistory = history.subList(start, history.size());

        StringBuilder context = new StringBuilder();
        for (ChatHistory chat : recentHistory) {
            context.append("User: ").append(chat.getUserMessage()).append("\n");
            context.append("Assistant: ").append(chat.getBotResponse()).append("\n");
        }
        return context.toString();
    }
}
