package com.example.health_assistant.model;

import lombok.Data;

@Data
public class ChatRequest {
    private Long userId;
    private String message;
}