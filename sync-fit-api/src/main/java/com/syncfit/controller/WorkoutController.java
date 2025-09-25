package com.syncfit.controller;

import com.syncfit.dto.WorkoutCreateRequest;
import com.syncfit.entity.Workout;
import com.syncfit.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    /**
     * GET /workouts - Get all workouts or filter by week
     * @param week Optional parameter in format YYYY-WW (e.g., 2024-W15)
     */
    @GetMapping
    public ResponseEntity<List<Workout>> getWorkouts(
            @RequestParam(required = false) String week,
            @RequestParam(required = false) String exercise,
            @RequestParam(required = false) Integer days) {
        
        List<Workout> workouts;
        
        if (exercise != null && !exercise.trim().isEmpty()) {
            workouts = workoutService.searchWorkoutsByExercise(exercise);
        } else if (days != null && days > 0) {
            workouts = workoutService.getRecentWorkouts(days);
        } else if (week != null && !week.trim().isEmpty()) {
            workouts = workoutService.getWorkoutsByWeek(week);
        } else {
            workouts = workoutService.getAllWorkouts();
        }
        
        return ResponseEntity.ok(workouts);
    }

    /**
     * GET /workouts/{id} - Get workout by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    /**
     * POST /workouts - Create a new workout
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createWorkout(@Valid @RequestBody WorkoutCreateRequest request) {
        Workout createdWorkout = workoutService.createWorkout(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Workout created successfully");
        response.put("workout", createdWorkout);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /workouts/{id} - Delete workout by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Workout deleted successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /workouts/{id} - Update workout by ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @Valid @RequestBody WorkoutCreateRequest request) {
        Workout updatedWorkout = workoutService.updateWorkout(id, request);
        return ResponseEntity.ok(updatedWorkout);
    }
}