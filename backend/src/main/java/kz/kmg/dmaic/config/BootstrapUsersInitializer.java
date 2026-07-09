package kz.kmg.dmaic.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.kmg.dmaic.entity.Role;
import kz.kmg.dmaic.entity.User;
import kz.kmg.dmaic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BootstrapUsersInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Value("${BOOTSTRAP_USERS_JSON:[]}")
    private String bootstrapUsersJson;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<BootstrapUser> users = objectMapper.readValue(
                bootstrapUsersJson,
                new TypeReference<>() {});

        for (BootstrapUser candidate : users) {
            if (!candidate.isValid()) {
                throw new IllegalArgumentException(
                        "Each BOOTSTRAP_USERS_JSON entry requires username (3+), password (6+) and fullName");
            }
            if (userRepository.existsByUsername(candidate.username())) {
                continue;
            }

            User user = User.builder()
                    .username(candidate.username())
                    .passwordHash(passwordEncoder.encode(candidate.password()))
                    .fullName(candidate.fullName())
                    .position(candidate.position())
                    .role(Role.PARTICIPANT)
                    .build();
            userRepository.save(user);
            log.info("Bootstrap participant '{}' created.", candidate.username());
        }
    }

    private record BootstrapUser(
            String username,
            String password,
            String fullName,
            String position
    ) {
        private boolean isValid() {
            return username != null && username.length() >= 3
                    && password != null && password.length() >= 6
                    && fullName != null && !fullName.isBlank();
        }
    }
}