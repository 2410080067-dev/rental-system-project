package com.rental.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for serving React frontend static files
 * Forwards all unmatched routes to index.html for client-side routing
 * This fixes the blank page issue when refreshing React Router routes
 */
@Controller
public class FrontendController {

    /**
     * Catch all unmatched routes and forward to index.html
     * This allows React Router to handle client-side routing
     * Applies to all paths except /api/* (API endpoints)
     */
    @GetMapping(value = {
        "/",
        "/{x:[\\w\\-]+}",
        "/{x:^(?!api$).*$}/{y:[\\w\\-]+}",
        "/{x:^(?!api$).*$}/{y:[\\w\\-]+}/{z:[\\w\\-]+}"
    })
    public String index() {
        return "forward:/index.html";
    }

}
