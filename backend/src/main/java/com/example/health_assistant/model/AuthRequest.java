package com.example.health_assistant.model;
import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}