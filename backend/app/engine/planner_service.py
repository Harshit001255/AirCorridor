import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))

from pathfinder import astar


def plan_path(grid, start, goal):
    start_tuple = tuple(start)
    goal_tuple = tuple(goal)

    # Automatically pad 2D coordinates to 3D if altitude is omitted
    if len(start_tuple) == 2:
        start_tuple = (start_tuple[0], start_tuple[1], 0)
    if len(goal_tuple) == 2:
        goal_tuple = (goal_tuple[0], goal_tuple[1], 0)

    path = astar(grid, start_tuple, goal_tuple)

    if path is None:
        return{
            "success": False,
            "path": None,
            "path_length": 0,
            "message": "No valid path found between start and goal."
        }

    path_as_lists = [list(cell) for cell in path]

    return{
        "success": True,
        "path": path_as_lists,
        "path_length": len(path_as_lists),
        "message": "Path found successfully."
    }

import copy

def replan_path(grid, current_position, goal, new_obstacles):
    updated_grid = copy.deepcopy(grid)

    for obstacle in new_obstacles:
        row, col, alt = obstacle
        updated_grid[row][col][alt] = 1

    return plan_path(updated_grid, current_position, goal)


if __name__=="__main__":
    test_grid = [
        [[0], [0], [0]],
        [[0], [1], [0]],
        [[0], [0], [0]]
    ]
    result = plan_path(test_grid, [0, 0, 0], [2, 2, 0])
    print(result)

    blocked_grid = [
        [[0], [1], [0]],
        [[1], [1], [1]],
        [[0], [1], [0]]
    ]
    no_path_result = plan_path(blocked_grid, [0, 0, 0], [2, 2, 0])
    print(no_path_result)

    original_grid = [
        [[0], [0], [0]],
        [[0], [0], [0]],
        [[0], [0], [0]]
    ]
    initial = plan_path(original_grid, [0, 0, 0], [2, 2, 0])
    print("Initial path:", initial)

    drone_current_pos = [0, 1, 0]

    new_obstacles = [(1, 1, 0), (1, 2, 0)]

    rerouted = replan_path(original_grid, drone_current_pos, [2, 2, 0], new_obstacles)
    print("Rerouted path:", rerouted)