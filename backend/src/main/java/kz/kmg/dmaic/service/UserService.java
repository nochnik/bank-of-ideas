package kz.kmg.dmaic.service;

import kz.kmg.dmaic.dto.CreateUserRequest;
import kz.kmg.dmaic.dto.UserProfileResponse;
import kz.kmg.dmaic.entity.Role;
import kz.kmg.dmaic.entity.User;
import kz.kmg.dmaic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse createParticipant(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken: " + request.username());
        }
        User user = User.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .position(request.position())
                .role(Role.PARTICIPANT)
                .build();
        User saved = userRepository.save(user);
        return toProfileResponse(saved);
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return toProfileResponse(user);
    }

    public UserProfileResponse updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setAvatarUrl(avatarUrl);
        return toProfileResponse(userRepository.save(user));
    }

    public Long findIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<UserProfileResponse> getAllParticipants() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PARTICIPANT)
                .map(this::toProfileResponse)
                .toList();
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getPosition(),
                user.getAvatarUrl(),
                user.getRole().name());
    }
}
