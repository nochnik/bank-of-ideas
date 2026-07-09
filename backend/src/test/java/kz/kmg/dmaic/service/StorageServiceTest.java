package kz.kmg.dmaic.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void storesLoadsAndDeletesAvatar() throws Exception {
        StorageService storage = new StorageService(tempDir.toString(), "https://api.example.com/");
        storage.initialize();
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.png", "image/png", new byte[]{1, 2, 3});

        String url = storage.uploadAvatar(7L, file);
        String fileName = url.substring(url.lastIndexOf('/') + 1);

        assertTrue(url.startsWith("https://api.example.com/api/files/avatars/7/"));
        assertTrue(storage.load("avatars", 7L, fileName).exists());

        storage.deleteFile(url);

        assertThrows(IllegalArgumentException.class, () -> storage.load("avatars", 7L, fileName));
    }

    @Test
    void rejectsUnsafeFilePath() throws Exception {
        StorageService storage = new StorageService(tempDir.toString(), "https://api.example.com");
        storage.initialize();

        assertThrows(IllegalArgumentException.class,
                () -> storage.load("../private", 7L, "secret.txt"));
    }
}