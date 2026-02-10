package com.rental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration for serving static files and SPA routing
 * Ensures React app static files are served correctly and routes are handled by React Router
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configure resource handlers to serve static files from the React build directory
     * The React build output (from npm run build) is placed in src/main/resources/static
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources (JS, CSS, images) from the static directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);  // Cache for 1 hour

        // Add common static file extensions
        registry.addResourceHandler("/css/**", "/js/**", "/images/**", "/assets/**")
                .addResourceLocations("classpath:/static/css/", "classpath:/static/js/", 
                                    "classpath:/static/images/", "classpath:/static/assets/")
                .setCachePeriod(3600);
    }
}
