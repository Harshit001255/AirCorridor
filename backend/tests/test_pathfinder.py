import sys
import os 
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app', 'core'))

from pathfinder import astar, heuristic, get_neighbors


def test_heuristic_basic():
    assert heuristic((0, 0, 0), (2, 2, 0)) == 4
    assert heuristic((0, 0, 0), (1, 1, 1)) == 3
    assert heuristic((5, 5, 5), (5, 5, 5)) == 0


def test_get_neighbors_open():
    grid = [
        [[0], [0], [0]],
        [[0], [1], [0]],
        [[0], [0], [0]]
    ]
    neighbours = get_neighbors((1, 0, 0), grid)
    assert set(neighbours) == {(0, 0, 0), (2, 0, 0)}


def test_get_neighbors_3d_altitude():
    grid = [
        [[0, 0], [0, 0]],
        [[0, 1], [0, 0]]
    ]
    neighbours = get_neighbors((0, 0, 0), grid)
    assert (0, 0, 1) in neighbours
    assert (1, 0, 0) in neighbours


def test_astar_finds_optimal_path():
    grid = [
        [[0], [0], [0]],
        [[0], [1], [0]],
        [[0], [0], [0]]
    ]
    path = astar(grid, (0, 0, 0), (2, 2, 0))
    assert path is not None
    assert path[0] == (0, 0, 0)
    assert path[-1] == (2, 2, 0)
    assert len(path) == 5


def test_astar_3d_finds_optimal_path():
    grid = [
        [[0, 0], [0, 0]],
        [[0, 1], [0, 0]]
    ]
    path = astar(grid, (0, 0, 0), (1, 1, 1))
    assert path is not None
    assert path[0] == (0, 0, 0)
    assert path[-1] == (1, 1, 1)
    assert len(path) == 4


def test_astar_no_path_exists():
    grid = [
        [[0], [1], [0]],
        [[1], [1], [1]],
        [[0], [1], [0]]
    ]
    path = astar(grid, (0, 0, 0), (2, 2, 0))
    assert path is None



if __name__ == "__main__":
    test_heuristic_basic()
    test_get_neighbors_open()
    test_get_neighbors_3d_altitude()
    test_astar_finds_optimal_path()
    test_astar_3d_finds_optimal_path()
    test_astar_no_path_exists()
    print("All tests passed!")