package com.syncfit.dto;

import java.math.BigDecimal;

public class WeeklyStats {

    private String week; // Format: YYYY-WW
    private BigDecimal volume;
    private int totalWorkouts;

    // Constructors
    public WeeklyStats() {}

    public WeeklyStats(String week, BigDecimal volume, int totalWorkouts) {
        this.week = week;
        this.volume = volume;
        this.totalWorkouts = totalWorkouts;
    }

    // Getters and Setters
    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public BigDecimal getVolume() {
        return volume;
    }

    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    @Override
    public String toString() {
        return "WeeklyStats{" +
                "week='" + week + '\'' +
                ", volume=" + volume +
                ", totalWorkouts=" + totalWorkouts +
                '}';
    }
}