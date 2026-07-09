package kz.kmg.dmaic.controller;

import kz.kmg.dmaic.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final StorageService storageService;

    @GetMapping("/api/files/{category}/{ownerId}/{fileName}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String category,
            @PathVariable Long ownerId,
            @PathVariable String fileName) throws IOException {
        Resource resource = storageService.load(category, ownerId, fileName);
        String contentType = Files.probeContentType(resource.getFile().toPath());
        MediaType mediaType = contentType == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(contentType);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS).cachePublic())
                .body(resource);
    }
}