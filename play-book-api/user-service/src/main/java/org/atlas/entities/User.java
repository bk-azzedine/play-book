package org.atlas.entities;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;

import org.springframework.data.relational.core.mapping.Table;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Table(name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User  implements UserDetails {

    @Id
    private UUID user_id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean isEnabled;
    private boolean isActivated;
    private boolean isSetUp;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }
}
