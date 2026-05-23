package com.example.fitboard.file.dto;

import lombok.Getter;

@Getter
public class FileUploadResponse {

    private final String imageUrl;

    public FileUploadResponse(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}