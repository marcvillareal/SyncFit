package com.syncfit.controller;

import com.syncfit.dto.WeeklyStats;
import com.syncfit.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private WorkoutService workoutService;

    /**
     * GET /stats - Get weekly statistics
     * @param range Range parameter like "last4w" for last 4 weeks (default: last4w)
     */
    @GetMapping
    public ResponseEntity<List<WeeklyStats>> getWeeklyStats(
            @RequestParam(required = false, defaultValue = "last4w") String range) {
        
        List<WeeklyStats> stats = workoutService.getWeeklyStats(range);
        return ResponseEntity.ok(stats);
    }
}