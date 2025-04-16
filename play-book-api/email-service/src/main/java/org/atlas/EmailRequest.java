package org.atlas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.atlas.enums.Template;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {
    String to;
    String username;
    Template templateEnum;
    String activationCode;
    String subject;
}
