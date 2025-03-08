package org.atlas.services;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;
@Service
public class RouteValidatorService {
    public static final List<String> openApiEndpoints = List.of(
            "/user/register",
            "/auth/authenticate"
    );
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
