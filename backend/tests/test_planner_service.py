import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app', 'engine'))

from planner_service import plan_path, replan_path


def test_plan_path_success():
    grid = [
        [[0], [0], [0]],
        [[0], [1], [0]],
        [[0], [0], [0]]
    ]
    result = plan_path(grid, [0, 0, 0], [2, 2, 0])
    assert result["success"] is True
    assert result["path"][0] == [0, 0, 0]
    assert result["path"][-1] == [2, 2, 0]


def test_plan_path_no_path():
    grid = [
        [[0], [1], [0]],
        [[1], [1], [1]],
        [[0], [1], [0]]
    ]
    result = plan_path(grid, [0, 0, 0], [2, 2, 0])
    assert result["success"] is False
    assert result["path"] is None


def test_replan_path_avoids_new_obstacle():
    grid = [
        [[0], [0], [0]],
        [[0], [0], [0]],
        [[0], [0], [0]]
    ]
    new_obstacles = [(1, 1, 0), (1, 2, 0)]

    result = replan_path(grid, [0, 1, 0], [2, 2, 0], new_obstacles)

    assert result["success"] is True
    for cell in result["path"]:
        assert tuple(cell) not in new_obstacles


def test_replan_path_does_not_mutate_original_grid():
    grid = [
        [[0], [0], [0]],
        [[0], [0], [0]],
        [[0], [0], [0]]
    ]
    new_obstacles = [(1, 1, 0)]

    replan_path(grid, [0, 0, 0], [2, 2, 0], new_obstacles)

    assert grid[1][1][0] == 0


if __name__ == "__main__":
    test_plan_path_success()
    test_plan_path_no_path()
    test_replan_path_avoids_new_obstacle()
    test_replan_path_does_not_mutate_original_grid()
    print("All tests passed!")