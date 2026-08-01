import heapq

def heuristic(cell, goal):
    row_of_cell = cell[0]
    row_of_goal = goal[0]
    col_of_cell = cell[1]
    col_of_goal = goal[1]
    distance = abs(row_of_cell - row_of_goal) + abs(col_of_cell - col_of_goal)

    return distance

def get_neighbors(cell, grid):
    row = cell[0]
    col = cell[1]
    up = (row - 1, col)
    down = (row + 1, col)
    left = (row, col - 1)
    right = (row, col + 1)

    no_of_rows = len(grid)
    no_of_col = len(grid[0])  

    neighbours = []
    if 0<= up[0] < no_of_rows and 0<= up[1] < no_of_col:
        if grid[up[0]][up[1]] == 0:
            neighbours.append(up)

    if 0<= down[0] < no_of_rows and 0<= down[1] < no_of_col:
            if grid[down[0]][down[1]] == 0:
                neighbours.append(down)

    if 0<= left[0] < no_of_rows and 0<= left[1] < no_of_col:
            if grid[left[0]][left[1]] == 0:
                neighbours.append(left)

    if 0<= right[0] < no_of_rows and 0<= right[1] < no_of_col:
            if grid[right[0]][right[1]] == 0:
                neighbours.append(right)

    return neighbours

def astar(grid, start, goal):
    # TODO:
    # 1. open list -> priority queue, push (f, start), start with g=0
    # 2. g_scores -> dict, {start: 0}
    # 3. parents -> dict, empty for now
    # 4. closed_set -> empty set
    #
    # loop while open list isn't empty:
    #   - pop lowest-f cell -> current
    #   - if current == goal: reconstruct path and return it
    #   - add current to closed_set
    #   - for each neighbor of current:
    #       - skip if blocked or in closed_set
    #       - tentative_g = g_scores[current] + 1  (cost of one step)
    #       - if neighbor not in g_scores OR tentative_g < g_scores[neighbor]:
    #           - update g_scores[neighbor], parents[neighbor] = current
    #           - push (tentative_g + heuristic(neighbor, goal), neighbor) to open list
    #
    # if loop ends without finding goal: no path exists, return None
    pass

def reconstruct_path(parents, current):
    # TODO: walk backward through parents dict from current to start,
    # then reverse the resulting list
    pass


if __name__ == "__main__":
    test_grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]
    print(get_neighbors((1, 0), test_grid))
    print(heuristic((0, 0), (2, 2)))