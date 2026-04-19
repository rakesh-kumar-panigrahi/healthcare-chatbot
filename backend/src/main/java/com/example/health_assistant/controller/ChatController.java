package com.example.health_assistant.controller;
import com.example.health_assistant.model.*;
import com.example.health_assistant.service.ChatHistoryService;
import com.example.health_assistant.service.GroqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/healthcare")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private GroqService groqService;

    @Autowired
    private ChatHistoryService chatHistoryService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {

        // Input validation
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Please enter a valid message."));
        }

        if (request.getUserId() == null) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("User ID is required."));
        }

        // Get last 5 conversations for context
        String context = chatHistoryService.buildConversationContext(request.getUserId());

        // Call Gemini API
        String botResponse = groqService.chat(request.getMessage(), context);

        // Save chat to database
        chatHistoryService.saveChat(request.getUserId(), request.getMessage(), botResponse);

        return ResponseEntity.ok(new ChatResponse(botResponse));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatHistory>> getHistory(@PathVariable Long userId) {
        List<ChatHistory> history = chatHistoryService.getChatHistory(userId);
        return ResponseEntity.ok(history);
    }
}
