package kz.kmg.dmaic.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class StorageService {

    private static final Map<String, String> AVATAR_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp");

    private static final Set<String> STAGE_FILE_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/msword",
            "application/vnd.ms-excel",
            "image/jpeg",
            "image/png",
            "image/webp");

    private static final Map<String, String> STAGE_EXTENSIONS = Map.ofEntries(
            Map.entry("application/pdf", ".pdf"),
            Map.entry("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
            Map.entry("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
            Map.entry("application/msword", ".doc"),
            Map.entry("application/vnd.ms-excel", ".xls"),
            Map.entry("image/jpeg", ".jpg"),
            Map.entry("image/png", ".png"),
            Map.entry("image/webp", ".webp"));

    private static final long MAX_AVATAR_SIZE = 5 * 1024 * 1024L;
    private static final long MAX_STAGE_FILE_SIZE = 10 * 1024 * 1024L;

    private final Path storageRoot;
    private final String publicApiUrl;

    public StorageService(
            @Value("${app.storage.path}") String storagePath,
            @Value("${app.public-api-url}") String publicApiUrl) {
        this.storageRoot = Path.of(storagePath).toAbsolutePath().normalize();
        this.publicApiUrl = publicApiUrl.replaceAll("/+$", "");
    }

    @PostConstruct
    public void initialize() throws IOException {
        Files.createDirectories(storageRoot);
    }

    public String uploadAvatar(Long userId, MultipartFile file) {
        String contentType = file.getContentType();
        validate(file, contentType, AVATAR_TYPES.keySet(), MAX_AVATAR_SIZE,
                "Only JPEG, PNG or WebP images are allowed");
        return store(file, "avatars", userId, AVATAR_TYPES.get(contentType));
    }

    public String uploadStageFile(Long stageId, MultipartFile file) {
        String contentType = file.getContentType();
        validate(file, contentType, STAGE_FILE_TYPES, MAX_STAGE_FILE_SIZE,
                "Allowed file types: PDF, DOCX, XLSX, DOC, XLS, JPEG, PNG, WebP");
        return store(file, "stages", stageId, STAGE_EXTENSIONS.get(contentType));
    }

    public Resource load(String category, Long ownerId, String fileName) {
        if (!Set.of("avatars", "stages").contains(category)
                || !fileName.matches("[a-f0-9-]+\\.[a-z0-9]+")) {
            throw new IllegalArgumentException("Invalid file path");
        }
        Path file = resolveSafe(category, ownerId.toString(), fileName);
        if (!Files.isRegularFile(file)) {
            throw new IllegalArgumentException("File not found");
        }
        try {
            return new UrlResource(file.toUri());
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid file path", e);
        }
    }

    public void deleteFile(String fileUrl) {
        String marker = "/api/files/";
        int markerIndex = fileUrl.indexOf(marker);
        if (markerIndex < 0) {
            return;
        }
        String[] parts = fileUrl.substring(markerIndex + marker.length()).split("/");
        if (parts.length != 3 || !Set.of("avatars", "stages").contains(parts[0])) {
            return;
        }
        try {
            Files.deleteIfExists(resolveSafe(parts));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    private String store(MultipartFile file, String category, Long ownerId, String extension) {
        String fileName = UUID.randomUUID() + extension;
        Path destination = resolveSafe(category, ownerId.toString(), fileName);
        try {
            Files.createDirectories(destination.getParent());
            file.transferTo(destination);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        return publicApiUrl + "/api/files/" + category + "/" + ownerId + "/" + fileName;
    }

    private void validate(MultipartFile file, String contentType, Set<String> allowedTypes,
                          long maxSize, String typeError) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new IllegalArgumentException(typeError);
        }
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds the allowed limit");
        }
    }

    private Path resolveSafe(String... parts) {
        Path result = storageRoot;
        for (String part : parts) {
            result = result.resolve(part);
        }
        result = result.normalize();
        if (!result.startsWith(storageRoot)) {
            throw new IllegalArgumentException("Invalid file path");
        }
        return result;
    }
}