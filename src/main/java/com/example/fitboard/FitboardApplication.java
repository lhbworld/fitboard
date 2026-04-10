package com.example.fitboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication
public class FitboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitboardApplication.class, args);
    }
}