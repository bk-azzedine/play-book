package org.atlas.entities;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;

import org.springframework.data.relational.core.mapping.Table;


import java.util.UUID;


@Table(name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private UUID user_id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;



}
