package kz.kmg.dmaic.service;

import kz.kmg.dmaic.dto.AuthResponse;
import kz.kmg.dmaic.dto.LoginRequest;
import kz.kmg.dmaic.entity.User;
import kz.kmg.dmaic.repository.UserRepository;
import kz.kmg.dmaic.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByUsername(request.username()).orElseThrow();
        return new AuthResponse(token, user.getRole().name(), user.getId());
    }
}
