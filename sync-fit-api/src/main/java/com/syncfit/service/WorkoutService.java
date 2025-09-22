package com.syncfit.service;

import com.syncfit.dto.WeeklyStats;
import com.syncfit.dto.WorkoutCreateRequest;
import com.syncfit.entity.Workout;
import com.syncfit.repository.WorkoutRepository;
import com.syncfit.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    /**
     * Get all workouts
     */
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAllOrderByDateDesc();
    }

    /**
     * Get workouts filtered by week (YYYY-WW format)
     */
    public List<Workout> getWorkoutsByWeek(String week) {
        if (week == null || week.trim().isEmpty()) {
            return getAllWorkouts();
        }

        LocalDate[] weekDates = parseWeekString(week);
        LocalDate startOfWeek = weekDates[0];
        LocalDate endOfWeek = weekDates[1];

        return workoutRepository.findByDateBetween(startOfWeek, endOfWeek);
    }

    /**
     * Get workout by ID
     */
    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
    }

    /**
     * Create a new workout
     */
    public Workout createWorkout(WorkoutCreateRequest request) {
        Workout workout = new Workout(
                request.getDate(),
                request.getExercise(),
                request.getSets(),
                request.getReps(),
                request.getWeight(),
                request.getRpe()
        );

        return workoutRepository.save(workout);
    }

    /**
     * Get weekly statistics for the last N weeks
     */
    public List<WeeklyStats> getWeeklyStats(String range) {
        int weeks = parseRangeString(range);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusWeeks(weeks - 1).with(java.time.DayOfWeek.MONDAY);

        List<Workout> workouts = workoutRepository.findByDateBetween(startDate, endDate);

        // Group workouts by week
        Map<String, List<Workout>> workoutsByWeek = workouts.stream()
                .collect(Collectors.groupingBy(this::getWeekString));

        List<WeeklyStats> stats = new ArrayList<>();

        // Generate stats for each week in the range
        LocalDate currentWeekStart = startDate;
        while (!currentWeekStart.isAfter(endDate)) {
            String weekString = getWeekString(currentWeekStart);
            List<Workout> weekWorkouts = workoutsByWeek.getOrDefault(weekString, new ArrayList<>());

            BigDecimal totalVolume = weekWorkouts.stream()
                    .map(Workout::getVolume)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            stats.add(new WeeklyStats(weekString, totalVolume, weekWorkouts.size()));
            currentWeekStart = currentWeekStart.plusWeeks(1);
        }

        return stats;
    }

    /**
     * Delete workout by ID
     */
    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workout not found with id: " + id);
        }
        workoutRepository.deleteById(id);
    }

    /**
     * Search workouts by exercise name
     */
    public List<Workout> searchWorkoutsByExercise(String exerciseName) {
        return workoutRepository.findByExerciseContainingIgnoreCase(exerciseName);
    }

    /**
     * Get workouts from the last N days
     */
    public List<Workout> getRecentWorkouts(int days) {
        LocalDate fromDate = LocalDate.now().minusDays(days);
        return workoutRepository.findWorkoutsFromDate(fromDate);
    }

    // Private helper methods

    /**
     * Parse week string (YYYY-WW) to get start and end dates
     */
    private LocalDate[] parseWeekString(String week) {
        try {
            String[] parts = week.split("-W");
            if (parts.length != 2) {
                parts = week.split("-");
                if (parts.length != 2) {
                    throw new IllegalArgumentException("Invalid week format. Expected YYYY-WW or YYYY-W##");
                }
            }

            int year = Integer.parseInt(parts[0]);
            int weekNumber = Integer.parseInt(parts[1]);

            LocalDate startOfYear = LocalDate.of(year, 1, 1);
            LocalDate startOfWeek = startOfYear
                    .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, weekNumber)
                    .with(java.time.DayOfWeek.MONDAY);

            LocalDate endOfWeek = startOfWeek.plusDays(6);

            return new LocalDate[]{startOfWeek, endOfWeek};
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid week format: " + week + ". Expected format: YYYY-WW");
        }
    }

    /**
     * Get week string (YYYY-WW) for a given date
     */
    private String getWeekString(LocalDate date) {
        int year = date.get(IsoFields.WEEK_BASED_YEAR);
        int week = date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        return String.format("%d-W%02d", year, week);
    }

    private String getWeekString(Workout workout) {
        return getWeekString(workout.getDate());
    }

    /**
     * Parse range string like "last4w" to extract number of weeks
     */
    private int parseRangeString(String range) {
        if (range == null || range.trim().isEmpty()) {
            return 4; // Default to 4 weeks
        }

        range = range.toLowerCase().trim();
        
        if (range.startsWith("last") && range.endsWith("w")) {
            try {
                String numberPart = range.substring(4, range.length() - 1);
                return Integer.parseInt(numberPart);
            } catch (NumberFormatException e) {
                return 4; // Default fallback
            }
        }

        // Try to parse as just a number
        try {
            return Integer.parseInt(range);
        } catch (NumberFormatException e) {
            return 4; // Default fallback
        }
    }
}