package com.example.health_assistant.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final WebClient webClient = WebClient.create();

    private static final String SYSTEM_PROMPT =
            "You are a helpful healthcare assistant. " +
                    "You provide general health information, explain symptoms, " +
                    "suggest basic remedies, and guide users on when to see a doctor. " +
                    "Always remind users that your responses are for general guidance only " +
                    "and not a substitute for professional medical advice. " +
                    "If a question is not related to healthcare, politely decline to answer.";

    public String chat(String userMessage, String conversationContext) {

        // Build messages list for Groq
        // Groq follows OpenAI format - system, assistant, user messages
        String userContent = conversationContext != null && !conversationContext.isEmpty()
                ? "Previous conversation:\n" + conversationContext + "\nUser: " + userMessage
                : userMessage;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", SYSTEM_PROMPT
                        ),
                        Map.of(
                                "role", "user",
                                "content", userContent
                        )
                ),
                "max_tokens", 1024,
                "temperature", 0.7
        );

        try {
            return webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> {
                        System.out.println("Raw Response: " + response);
                        var choices = (List) response.get("choices");
                        var message = (Map) ((Map) choices.get(0)).get("message");
                        return (String) message.get("content");
                    })
                    .block();

        } catch (WebClientResponseException e) {
            System.out.println("Groq API Error: " + e.getStatusCode());
            System.out.println("Response: " + e.getResponseBodyAsString());
            return "Sorry I am unable to process your request right now. Please try again.";

        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return "Something went wrong. Please try again.";
        }
    }
}