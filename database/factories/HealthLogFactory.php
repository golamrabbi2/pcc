<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HealthLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(['green', 'amber', 'red']),
            'reason' => fake()->sentence(),
            'metrics' => ['health_score' => fake()->numberBetween(0, 100)],
            'checked_at' => fake()->dateTimeThisMonth(),
        ];
    }
}
