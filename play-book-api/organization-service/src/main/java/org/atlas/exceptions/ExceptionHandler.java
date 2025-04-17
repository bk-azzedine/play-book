package org.atlas.exceptions;

import org.springframework.web.bind.annotation.ControllerAdvice;

import java.lang.reflect.Field;
@ControllerAdvice
public class ExceptionHandler {
    private ExceptionHandler() {}

    public static <E extends Enum<E>> ExceptionInfo processEnum(E enumValue) {
        String message = null;
        ExceptionType exceptionType = null;

        Field[] fields = enumValue.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (!field.isEnumConstant() && !field.getName().equals("$VALUES")) {

                try {
                    if (field.getName().equals("message") && field.get(enumValue) != null) {
                        message = field.get(enumValue).toString();
                    }
                    if (field.getType().equals(ExceptionType.class) && field.get(enumValue) != null) {
                        exceptionType = (ExceptionType) field.get(enumValue);
                    }

                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Failed to process enum fields", e);
                }
            }
        }

        return new ExceptionInfo(message, exceptionType);
    }
}
