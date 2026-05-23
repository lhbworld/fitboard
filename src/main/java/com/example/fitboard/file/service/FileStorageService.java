package com.example.fitboard.file.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 이미지를 선택해주십시오.");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("파일 형식이 올바르지 않습니다.");
        }

        String extension = getExtension(originalFilename).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("jpg, jpeg, png, webp 파일만 업로드할 수 있습니다.");
        }

        String savedFilename = UUID.randomUUID() + "." + extension;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            Path targetPath = uploadPath.resolve(savedFilename);
            file.transferTo(targetPath.toFile());

            return "/uploads/images/" + savedFilename;
        } catch (IOException e) {
            throw new IllegalArgumentException("이미지 저장 중 오류가 발생했습니다.");
        }
    }

    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}