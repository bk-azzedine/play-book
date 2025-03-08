package org.atlas.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public record SignInRequest( String username, String password) {

}
