package com.syncfit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "workout_date", nullable = false)
    private LocalDate date;

    @NotBlank(message = "Exercise name is required")
    @Size(min = 2, max = 100, message = "Exercise name must be between 2 and 100 characters")
    @Column(name = "exercise", nullable = false, length = 100)
    private String exercise;

    @NotNull(message = "Sets is required")
    @Min(value = 1, message = "Sets must be at least 1")
    @Max(value = 50, message = "Sets cannot exceed 50")
    @Column(name = "sets", nullable = false)
    private Integer sets;

    @NotNull(message = "Reps is required")
    @Min(value = 1, message = "Reps must be at least 1")
    @Max(value = 1000, message = "Reps cannot exceed 1000")
    @Column(name = "reps", nullable = false)
    private Integer reps;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Weight must be greater than 0")
    @DecimalMax(value = "1000.0", message = "Weight cannot exceed 1000kg")
    @Column(name = "weight", nullable = false, precision = 6, scale = 2)
    private BigDecimal weight;

    @NotNull(message = "RPE is required")
    @DecimalMin(value = "1.0", message = "RPE must be at least 1")
    @DecimalMax(value = "10.0", message = "RPE cannot exceed 10")
    @Column(name = "rpe", nullable = false, precision = 3, scale = 1)
    private BigDecimal rpe;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    // Constructors
    public Workout() {}

    public Workout(LocalDate date, String exercise, Integer sets, Integer reps, BigDecimal weight, BigDecimal rpe) {
        this.date = date;
        this.exercise = exercise;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.rpe = rpe;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public BigDecimal getRpe() {
        return rpe;
    }

    public void setRpe(BigDecimal rpe) {
        this.rpe = rpe;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    // Utility method to calculate volume (sets * reps * weight)
    public BigDecimal getVolume() {
        return weight.multiply(BigDecimal.valueOf(sets * reps));
    }

    @Override
    public String toString() {
        return "Workout{" +
                "id=" + id +
                ", date=" + date +
                ", exercise='" + exercise + '\'' +
                ", sets=" + sets +
                ", reps=" + reps +
                ", weight=" + weight +
                ", rpe=" + rpe +
                ", volume=" + getVolume() +
                '}';
    }
}