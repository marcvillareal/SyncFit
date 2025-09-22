package com.syncfit.repository;

import com.syncfit.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    // Find workouts by date range (for weekly filtering)
    @Query("SELECT w FROM Workout w WHERE w.date BETWEEN :startDate AND :endDate ORDER BY w.date DESC, w.createdAt DESC")
    List<Workout> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find workouts for a specific date
    List<Workout> findByDateOrderByCreatedAtDesc(LocalDate date);

    // Find workouts within the last N days
    @Query("SELECT w FROM Workout w WHERE w.date >= :fromDate ORDER BY w.date DESC, w.createdAt DESC")
    List<Workout> findWorkoutsFromDate(@Param("fromDate") LocalDate fromDate);

    // Find all workouts ordered by date (most recent first)
    @Query("SELECT w FROM Workout w ORDER BY w.date DESC, w.createdAt DESC")
    List<Workout> findAllOrderByDateDesc();

    // Count workouts for a specific date range
    @Query("SELECT COUNT(w) FROM Workout w WHERE w.date BETWEEN :startDate AND :endDate")
    long countWorkoutsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find workouts by exercise name (case insensitive)
    @Query("SELECT w FROM Workout w WHERE LOWER(w.exercise) LIKE LOWER(CONCAT('%', :exerciseName, '%')) ORDER BY w.date DESC")
    List<Workout> findByExerciseContainingIgnoreCase(@Param("exerciseName") String exerciseName);
}