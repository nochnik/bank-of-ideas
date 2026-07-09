package kz.kmg.dmaic.config;

import jakarta.annotation.PostConstruct;
import kz.kmg.dmaic.entity.Role;
import kz.kmg.dmaic.entity.User;
import kz.kmg.dmaic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    @PostConstruct
    public void ensureAdminExists() {
        if (userRepository.existsByUsername(adminUsername)) {
            return;
        }
        if (adminPassword == null || adminPassword.isBlank()) {
            log.error("ADMIN_PASSWORD env var is not set. Cannot create admin account. " +
                      "Set app.admin.password (ADMIN_PASSWORD) and restart.");
            return;
        }
        User admin = User.builder()
                .username(adminUsername)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .fullName("Администратор")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("Admin account '{}' created successfully.", adminUsername);
    }
}
