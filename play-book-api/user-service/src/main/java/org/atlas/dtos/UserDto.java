package org.atlas.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {
    private UUID user_id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean isActivated;
    private boolean isSetUp;

}
