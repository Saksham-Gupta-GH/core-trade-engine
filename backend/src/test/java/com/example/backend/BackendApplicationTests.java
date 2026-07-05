package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.junit.jupiter.api.Disabled;

@SpringBootTest
@Disabled("Disabled because Context requires Supabase credentials in ENV variables")
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
