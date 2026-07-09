package kz.kmg.dmaic.controller;

import kz.kmg.dmaic.dto.UserProfileResponse;
import kz.kmg.dmaic.service.StorageService;
import kz.kmg.dmaic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final StorageService storageService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.findIdByUsername(userDetails.getUsername());
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        Long userId = userService.findIdByUsername(userDetails.getUsername());
        String url = storageService.uploadAvatar(userId, file);
        return ResponseEntity.ok(userService.updateAvatar(userId, url));
    }
}
