import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))

from pathfinder import astar


def plan_path(grid, start, goal):
    start_tuple = tuple(start)
    goal_tuple = tuple(goal)

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